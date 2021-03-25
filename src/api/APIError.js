class APIError extends Error {
  constructor(json) {
    super(json.title);
    this.status = json.status;
    this.description = json.description;
  }
}

export default APIError;
