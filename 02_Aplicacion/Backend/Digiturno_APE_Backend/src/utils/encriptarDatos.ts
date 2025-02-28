import crypto from 'crypto';
import dotenv from "dotenv";
dotenv.config()

const ENCRYPTION_KEY = process.env.KEY as string;
const IV_LENGTH = 16;

export function encrypt(text: string): string {
    const iv = crypto.randomBytes(IV_LENGTH); // Generamos un IV aleatorio
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted; // IV + texto cifrado
}

export function decrypt(encryptedText: string): string {
    const parts = encryptedText.split(':');
    const iv = Buffer.from(parts.shift()!, 'hex'); // Obtenemos el IV
    const encryptedTextWithoutIv = parts.join(':');
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let decrypted = decipher.update(encryptedTextWithoutIv, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
