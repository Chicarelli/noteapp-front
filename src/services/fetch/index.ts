export class Fetch {
    private baseURL:string = 'http://localhost:8000';

    private async request(url: string, body: null|{} = null,  method = 'GET') {
        const fetchResult = await fetch(
            `${this.baseURL + url}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : null,
                method
            });
        const result = await fetchResult.json();

        if (fetchResult.status.toString().startsWith('4') || fetchResult.status.toString().startsWith('5')) {
            alert('Ih, deu erro');
            throw new Error(result ? result : 'Error');
        }

        return result;
    }
    
    async get(url: string) {
        return await this.request(url);
    }

    async post(url: string, body: any = null) {
        return await this.request(url, body, 'POST');
    }

    async patch(url: string, body: any = null) {
        return await this.request(url, body, 'PATCH');
    }

    async delete(url: string) {
        return await this.request(url, null, 'DELETE');
    }
}