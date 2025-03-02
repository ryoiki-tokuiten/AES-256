# Secure Message - Image Encryption Website

A web-based application for encrypting and hiding messages within images using AES-256 encryption and steganography techniques.

## Features

- **Strong Encryption**: Uses AES-256 encryption to secure your messages
- **Steganography**: Hides your encrypted message within images
- **User-Friendly Interface**: Simple step-by-step process for encryption and decryption
- **Responsive Design**: Works well on desktop and mobile devices
- **No Server Communication**: All encryption/decryption happens locally in your browser

## How It Works

### Encryption Process
1. Upload an image to serve as the carrier for your encrypted message
2. Enter the message you want to encrypt
3. Provide a strong encryption key (password)
4. Click "Encrypt Message" to process
5. Download the resulting image which looks identical to the original but contains your hidden message

### Decryption Process
1. Upload an image that contains a hidden encrypted message
2. Enter the correct decryption key (password)
3. Click "Decrypt Message" to extract and decrypt the hidden message
4. View the decrypted message

## Technical Details

- **Encryption Algorithm**: AES-256 (Advanced Encryption Standard)
- **Message Hiding**: Least Significant Bit (LSB) steganography technique
- **Image Format**: PNG (to avoid compression losses)
- **Dependencies**: 
  - CryptoJS for AES encryption/decryption
  - Pure JavaScript for image manipulation and steganography

## Security Notes

- The security of your message depends significantly on the strength of your encryption key
- Always use strong, unique passwords for encryption
- The encrypted image may be slightly larger in file size than the original
- Modifying or compressing the encrypted image may corrupt the hidden message

## Limitations

- Large messages may not fit in small images
- JPEG compression will likely destroy the hidden message, so always use PNG format
- The encrypted image must be downloaded and saved, not screenshot

## How to Use

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No server or installation required!

## License

This project is open source and available for personal and educational use.

## Author

Created with ❤️ for secure communications 