/* This script was vibecoded with Gemini 2.5 Flash, but the need for it is real,
* as OpenSSL command-line tool is really hard to get to interoperate with CryptoJS / Web Crypto API
* also, even though my openssl cli tool is recent:
* $ openssl version
    OpenSSL 3.0.13 30 Jan 2024 (Library: OpenSSL 3.0.13 30 Jan 2024)
* it still lacks AES-GCM! which is present in libcrypto on my system!
* Since we use OpenSSL headers here, they need to be present in the OS
* one way is to install them with `sudo apt install libssl-dev`
* Compile with gcc -o encrypt_gcm encrypt.c -lcrypto
 https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/encrypt
# The Web Crypto API provides four algorithms that support the `encrypt()`
# and `decrypt()` operations. One of these - RSA-OAEP - is public-key
# cryptosystem. Other three are AES variants.
# The Web Crypto API supports three different AES modes: CTR, CBC, GCM.
# Only GCM is an authenticated mode.

# - We want symmetric encryption, so that my friends can decipher private
#   files using a simple password
# - GCM is recommended, so we will just stick to it even though authentication
#   is not important in our usecase

# Unfortunately, in my installation of openssl (even after sudo apt update, upgrade)
# I get the error "enc: AEAD ciphers not supported" while trying to use AES-GCM.
# So, it is just not supported somehow. Since auth is not important for us, we fallback
# to CBC mode (arbitrary choice, could use CTR as well).

# The Web Crypto API PBKDF2 supports SHA-256, SHA-384, SHA-512

# My OpenSSL front-end doesn't support AES-GCM. But it is actually there!
# $ openssl speed -evp aes-256-gcm
# Doing AES-256-GCM for 3s on 16 size blocks: 48444223 AES-256-GCM's in 3.00s
# Doing AES-256-GCM for 3s on 64 size blocks: 40214698 AES-256-GCM's in 3.00s
# Doing AES-256-GCM for 3s on 256 size blocks: 22111118 AES-256-GCM's in 3.00s
# Doing AES-256-GCM for 3s on 1024 size blocks: 7943633 AES-256-GCM's in 2.99s
# $ openssl enc -ciphers | grep aes
# -aes-128-cbc               -aes-128-cfb               -aes-128-cfb1             
# -aes-128-cfb8              -aes-128-ctr               -aes-128-ecb              
# -aes-128-ofb               -aes-192-cbc               -aes-192-cfb              
# -aes-192-cfb1              -aes-192-cfb8              -aes-192-ctr              
# -aes-192-ecb               -aes-192-ofb               -aes-256-cbc              
# -aes-256-cfb               -aes-256-cfb1              -aes-256-cfb8             
# -aes-256-ctr               -aes-256-ecb               -aes-256-ofb              
# -aes128                    -aes128-wrap               -aes192                   
# -aes192-wrap               -aes256                    -aes256-wrap              
# -id-aes128-wrap            -id-aes128-wrap-pad        -id-aes192-wrap           
# -id-aes192-wrap-pad        -id-aes256-wrap            -id-aes256-wrap-pad
*/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <openssl/evp.h>
#include <openssl/rand.h>
#include <openssl/err.h>
#include <openssl/sha.h> // For SHA512 in PBKDF2
#include <openssl/bio.h> // For Base64 encoding
#include <openssl/pem.h> // Needed for EVP_read_pw_string in some OpenSSL versions

// --- Configuration ---
#define PBKDF2_ITERATIONS 100000
#define AES_KEY_BITS      256
#define AES_KEY_BYTES     (AES_KEY_BITS / 8)
#define GCM_NONCE_BYTES   12 // Recommended GCM IV/Nonce length
#define GCM_TAG_BYTES     16 // GCM authentication tag length
#define MAX_PASSWORD_LEN  256 // Maximum length for password input

// --- Error Handling ---
void handleErrors(void) {
    ERR_print_errors_fp(stderr);
    abort();
}

// --- Helper: Base64 Encode ---
// Encodes a byte array to a Base64 string.
// Returns a dynamically allocated string, must be freed by the caller.
char* base64_encode(const unsigned char *input, size_t length) {
    BIO *b64 = NULL;
    BIO *bmem = NULL;
    char *b64_output = NULL;
    long b64_len = 0;

    b64 = BIO_new(BIO_f_base64());
    // BIO_set_flags(b64, BIO_FLAGS_BASE64_NO_NL); // Optional: remove newlines
    bmem = BIO_new(BIO_s_mem());
    b64 = BIO_push(b64, bmem);

    BIO_write(b64, input, length);
    BIO_flush(b64);

    b64_len = BIO_get_mem_data(bmem, &b64_output);
    
    // The BIO_get_mem_data returns a pointer to internal buffer, which is owned by BIO.
    // We need to copy it to a new buffer that we own.
    char *result = (char*)malloc(b64_len + 1);
    if (!result) handleErrors();
    memcpy(result, b64_output, b64_len);
    result[b64_len] = '\0'; // Null-terminate

    BIO_free_all(b64);
    return result;
}

int main(int argc, char *argv[]) {
    // --- Argument and File Handling ---
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <input_file>\n", argv[0]);
        return 1;
    }

    const char *input_filepath = argv[1];

    // Derive output filenames
    char output_filepath[256];
    char salt_filepath[256];
    char nonce_filepath[256];

    snprintf(output_filepath, sizeof(output_filepath), "%s.enc", input_filepath);
    snprintf(salt_filepath, sizeof(salt_filepath), "%s.salt", input_filepath);
    snprintf(nonce_filepath, sizeof(nonce_filepath), "%s.nonce", input_filepath);

    // --- Read Password from CLI ---
    char password_buffer[MAX_PASSWORD_LEN];
    // fprintf(stdout, "Enter encryption password: ");
    if (EVP_read_pw_string(password_buffer, MAX_PASSWORD_LEN, "Enter encryption password: ", 0) != 0) {
        fprintf(stderr, "Error: Failed to read password.\n");
        return 1;
    }
    const unsigned char *password = (const unsigned char *)password_buffer;
    size_t password_len = strlen((char *)password);

    // Read plaintext from file
    FILE *in_fp = fopen(input_filepath, "rb");
    if (!in_fp) {
        fprintf(stderr, "Error: Could not open input file '%s'\n", input_filepath);
        return 1;
    }
    fseek(in_fp, 0, SEEK_END);
    long plaintext_len = ftell(in_fp);
    fseek(in_fp, 0, SEEK_SET);

    unsigned char *plaintext = (unsigned char *)malloc(plaintext_len);
    if (!plaintext) {
        fprintf(stderr, "Error: Memory allocation failed for plaintext.\n");
        fclose(in_fp);
        return 1;
    }
    if (fread(plaintext, 1, plaintext_len, in_fp) != plaintext_len) {
        fprintf(stderr, "Error: Could not read full input file.\n");
        free(plaintext);
        fclose(in_fp);
        return 1;
    }
    fclose(in_fp);

    // --- OpenSSL Initialization (for error handling) ---
    // ERR_load_crypto_strings(); // Uncomment for more detailed OpenSSL error messages

    // --- Generate Salt and Nonce ---
    unsigned char salt[16]; // 16 bytes for PBKDF2 salt
    if (RAND_bytes(salt, sizeof(salt)) != 1) handleErrors();

    unsigned char nonce[GCM_NONCE_BYTES]; // 12 bytes for GCM nonce
    if (RAND_bytes(nonce, sizeof(nonce)) != 1) handleErrors();

    // --- Key Derivation (PBKDF2-SHA512) ---
    unsigned char key[AES_KEY_BYTES];
    if (PKCS5_PBKDF2_HMAC(
            (const char *)password, password_len,
            salt, sizeof(salt),
            PBKDF2_ITERATIONS,
            EVP_sha512(), // Use SHA-512
            AES_KEY_BYTES,
            key
        ) != 1) handleErrors();

    // Zero out password from memory immediately after key derivation
    OPENSSL_cleanse(password_buffer, password_len);

    // --- AES-GCM Encryption ---
    EVP_CIPHER_CTX *ctx = NULL;
    int len;
    int ciphertext_len = 0;
    unsigned char *ciphertext_buffer = NULL;
    unsigned char tag[GCM_TAG_BYTES];

    // Allocate buffer for ciphertext (plaintext_len)
    ciphertext_buffer = (unsigned char *)malloc(plaintext_len);
    if (!ciphertext_buffer) {
        fprintf(stderr, "Error: Memory allocation failed for ciphertext buffer.\n");
        free(plaintext);
        return 1;
    }

    // Create and initialize the context
    if (!(ctx = EVP_CIPHER_CTX_new())) handleErrors();

    // Initialize the encryption operation.
    if (1 != EVP_EncryptInit_ex(ctx, EVP_aes_256_gcm(), NULL, NULL, NULL)) handleErrors();

    // Set IV length. GCM_NONCE_BYTES is 12.
    if (1 != EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_SET_IVLEN, GCM_NONCE_BYTES, NULL)) handleErrors();

    // Now set the key and IV (nonce)
    if (1 != EVP_EncryptInit_ex(ctx, NULL, NULL, key, nonce)) handleErrors();

    // Provide the plaintext to be encrypted, and obtain the ciphertext output.
    if (1 != EVP_EncryptUpdate(ctx, ciphertext_buffer, &len, plaintext, plaintext_len)) handleErrors();
    ciphertext_len = len;

    // Finalize the encryption.
    if (1 != EVP_EncryptFinal_ex(ctx, ciphertext_buffer + len, &len)) handleErrors();
    ciphertext_len += len;

    // Get the authentication tag
    if (1 != EVP_CIPHER_CTX_ctrl(ctx, EVP_CTRL_GCM_GET_TAG, GCM_TAG_BYTES, tag)) handleErrors();

    // Clean up
    EVP_CIPHER_CTX_free(ctx);
    free(plaintext);

    // --- Output to Files (Base64 encoded) ---
    FILE *out_fp = fopen(output_filepath, "w");
    FILE *salt_fp = fopen(salt_filepath, "w");
    FILE *nonce_fp = fopen(nonce_filepath, "w");

    if (!out_fp || !salt_fp || !nonce_fp) {
        fprintf(stderr, "Error: Could not open output files for writing.\n");
        free(ciphertext_buffer);
        // Attempt to close any files that were opened successfully
        if (out_fp) fclose(out_fp);
        if (salt_fp) fclose(salt_fp);
        if (nonce_fp) fclose(nonce_fp);
        return 1;
    }

    // Concatenate ciphertext and tag for Web Crypto API
    unsigned char *final_ciphertext_with_tag = (unsigned char *)malloc(ciphertext_len + GCM_TAG_BYTES);
    if (!final_ciphertext_with_tag) {
        fprintf(stderr, "Error: Memory allocation failed for final ciphertext.\n");
        free(ciphertext_buffer);
        fclose(out_fp); fclose(salt_fp); fclose(nonce_fp);
        return 1;
    }
    memcpy(final_ciphertext_with_tag, ciphertext_buffer, ciphertext_len);
    memcpy(final_ciphertext_with_tag + ciphertext_len, tag, GCM_TAG_BYTES);
    
    char *b64_ciphertext_with_tag = base64_encode(final_ciphertext_with_tag, ciphertext_len + GCM_TAG_BYTES);
    char *b64_salt = base64_encode(salt, sizeof(salt));
    char *b64_nonce = base64_encode(nonce, sizeof(nonce));

    fprintf(out_fp, "%s", b64_ciphertext_with_tag);
    fprintf(salt_fp, "%s", b64_salt);
    fprintf(nonce_fp, "%s", b64_nonce);

    fclose(out_fp);
    fclose(salt_fp);
    fclose(nonce_fp);

    free(ciphertext_buffer);
    free(final_ciphertext_with_tag);
    free(b64_ciphertext_with_tag);
    free(b64_salt);
    free(b64_nonce);

    fprintf(stdout, "Encryption successful for '%s' using AES-256-GCM.\n", input_filepath);
    fprintf(stdout, "-------------------------------------------------------------------\n");
    fprintf(stdout, "Output Files:\n");
    fprintf(stdout, "  Ciphertext (Base64, includes GCM tag): %s\n", output_filepath);
    fprintf(stdout, "  Salt (Base64): %s\n", salt_filepath);
    fprintf(stdout, "  Nonce (Base64): %s\n", nonce_filepath);
    fprintf(stdout, "PBKDF2 Iterations: %d\n", PBKDF2_ITERATIONS);
    fprintf(stdout, "Remember to provide these values for browser decryption.\n");

    return 0;
}