import { app } from 'electron';
import path from 'path';
import fs from 'fs';

class DatabaseManager {
    private dbPath: string;

    constructor() {
        this.dbPath = path.join(app.getPath('userData'), 'database.json');
    }

    get(name: string) {
        try {
            if (fs.existsSync(this.dbPath)) {
                const data = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
                return data[name];
            }
        } catch (error) {
            console.error('Error reading:', error);
        }
        return null;
    }

    set(name: string, value: any) {
        try {
            let data: Record<string, any> = {};
            if (fs.existsSync(this.dbPath)) {
                data = JSON.parse(fs.readFileSync(this.dbPath, 'utf-8'));
            }
            data[name] = value;
            fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
            return value;
        } catch (error) {
            console.error('Error writing:', error);
            return null;
        }
    }
}

export const db = new DatabaseManager();