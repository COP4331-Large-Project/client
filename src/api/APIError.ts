type JSONError = {
  title?: string;
  status?: number;
  description?: string;
};

class APIError extends Error {

  readonly status: number;
  readonly description: string;
  
  constructor(json: JSONError) {
    super(json.title);
    this.status = json.status ?? 500;
    this.description = json.description ?? 'An Unexpected Error Occurred';
  }
}

export default APIError;
