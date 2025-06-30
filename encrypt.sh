#!/bin/bash

# Encrypt a file with OpenSSL using a hardcoded passphrase.
# Compatible with CryptoJS decryption:
# var decrypted = CryptoJS.AES.decrypt(openSSLEncrypted, "Secret Passphrase");
# Ignore OpenSSL warning "deprecated key derivation used";
# CryptoJS doesn't seem to support PBKDF2 as key derivation as of June 2025

if [ $# -ne 1 ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

infile="$1"
outfile="${infile}.enc"

openssl enc -aes-256-cbc -in "$infile" -out "$outfile" -pass pass:"Secret Passphrase" -e -base64

echo "Encrypted file written to: $outfile"

