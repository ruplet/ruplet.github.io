import sys
import email
import quopri
from email import policy
from email.header import decode_header
from email.parser import BytesParser

def decode_value(value):
    if isinstance(value, bytes):
        value = value.decode('utf-8', errors='replace')
    parts = decode_header(value)
    decoded = ''
    for part, encoding in parts:
        if isinstance(part, bytes):
            decoded += part.decode(encoding or 'utf-8', errors='replace')
        else:
            decoded += part
    return decoded

def extract_text_from_email(msg):
    if msg.is_multipart():
        for part in msg.walk():
            if part.get_content_type() == "text/plain":
                return decode_part(part)
    else:
        return decode_part(msg)
    return ""

def decode_part(part):
    charset = part.get_content_charset() or 'utf-8'
    payload = part.get_payload(decode=True)
    if not payload:
        return ""
    try:
        return payload.decode(charset, errors='replace')
    except LookupError:
        return payload.decode('utf-8', errors='replace')

def main():
    if len(sys.argv) < 2:
        print("Usage: python script.py file.eml")
        sys.exit(1)

    filename = sys.argv[1]

    with open(filename, 'rb') as f:
        msg = BytesParser(policy=policy.default).parse(f)

    subject = decode_value(msg.get('Subject', ''))
    # from_ = decode_value(msg.get('From', ''))
    # to = decode_value(msg.get('To', ''))
    date = decode_value(msg.get('Date', ''))

    body = extract_text_from_email(msg)

    # print(f"From: {from_}")
    # print(f"To: {to}")
    print(f"From: [Alice]")
    print(f"To: [Bob]")
    print(f"Date: {date}")
    print(f"Subject: {subject}")
    # print("\nBody:\n")
    print(body)

if __name__ == "__main__":
    main()

