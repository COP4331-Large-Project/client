class APIError extends Error {
  constructor(json) {
    super(json.title);
    this.status = parseInt(json.status, 10);
    this.description = json.description;
  }
}

export default APIError;
