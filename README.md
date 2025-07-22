# URL Shortener Microservice

This is a simple Node.js microservice that shortens valid URLs.

Built as part of the [FreeCodeCamp Back End Development and APIs](https://www.freecodecamp.org/learn/back-end-development-and-apis/) Certification project: **URL Shortener Microservice**

---

## Features

- Shortens valid URLs using a unique short code  
- Redirects to the original URL when the short version is accessed  
- Validates URLs using DNS lookup  
- Stores all URLs in a MongoDB database  
- Includes a simple web form to submit and test URLs  
- Built with Node.js, Express, MongoDB (via Mongoose), and NanoID  

---

## Example Usage

### Shorten a URL  
**POST** `/api/shorturl`  
**Body**:
```json
{
  "original_url": "https://www.example.com"
}

Response:

{
    "original_url": "https://www.example.com",
    "short_url": "saa8gt"
}

Redirect
GET `/api/shorturl/saa8gt`
Redirects to: `https://www.example.com`