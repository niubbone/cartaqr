import { Octokit } from '@octokit/rest';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Only POST requests are allowed.' });
    }

    const { data, password } = req.body;

    if (password !== process.env.UPDATE_PASSWORD) {
        return res.status(401).json({ message: 'Invalid password.' });
    }

    if (!data) {
        return res.status(400).json({ message: 'No data provided.' });
    }

    const owner = 'niubbone'; // <--- INSERISCI IL TUO USERNAME GITHUB
    const repo = 'cartaqr'; // <--- INSERISCI IL NOME DEL REPOSITORY
    const filePath = 'wines.json';

    const octokit = new Octokit({
        auth: process.env.GITHUB_TOKEN
    });

    try {
        const { data: { sha } } = await octokit.repos.getContent({
            owner,
            repo,
            path: filePath
        });

        const newContent = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');

        await octokit.repos.createOrUpdateFileContents({
            owner,
            repo,
            path: filePath,
            message: 'Aggiornamento disponibilità vini',
            content: newContent,
            sha
        });

        res.status(200).json({ message: 'File wines.json updated successfully!' });

    } catch (error) {
        console.error('Error updating file:', error);
        res.status(500).json({ message: 'Error updating file on GitHub.' });
    }
}
