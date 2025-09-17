import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Solo richieste POST sono permesse' });
    }

    const { data, password } = req.body;

    // ATTENZIONE: Usa una password semplice come misura di sicurezza.
    // Per un'app professionale, si userebbe un sistema di autenticazione più robusto.
    if (password !== process.env.UPDATE_PASSWORD) {
        return res.status(401).json({ message: 'Password non valida' });
    }

    if (!data) {
        return res.status(400).json({ message: 'Nessun dato fornito' });
    }

    try {
        const filePath = path.join(process.cwd(), 'wines.json');
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
        res.status(200).json({ message: 'File wines.json aggiornato con successo!' });
    } catch (error) {
        console.error('Errore durante la scrittura del file:', error);
        res.status(500).json({ message: 'Errore interno del server' });
    }
}
