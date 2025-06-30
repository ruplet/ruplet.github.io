#!/bin/bash

# Encrypt a file with OpenSSL using a hardcoded passphrase.
# Compatible with CryptoJS decryption:
# var decrypted = CryptoJS.AES.decrypt(openSSLEncrypted, "Secret Passphrase");
# Ignore OpenSSL warning "deprecated key derivation used";
# CryptoJS doesn't seem to support PBKDF2 as key derivation as of June 2025
# https://github.com/brix/crypto-js/issues/375

# To decrypt in CLI:
# openssl enc -d -aes-256-cbc -in question.txt.enc -base64

if [ $# -ne 1 ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

infile="$1"
outfile="${infile}.enc"

openssl enc -aes-256-cbc -in "$infile" -out "$outfile" -e -base64

echo "Encrypted file written to: $outfile"

