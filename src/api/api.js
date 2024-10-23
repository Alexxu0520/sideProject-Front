
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create an Axios instance
const API = axios.create({
    baseURL: 'http://localhost:8080',  // You can use any URL here
});

// Create a mock adapter
const mock = new MockAdapter(API);

// Mock the text annotation API response
mock.onPost('/text/annotate').reply(200, {
    tags: {
        violence: true,
        pornography: false,
        hate_speech: true
    }
});

// Mock the text moderation API response
mock.onPost('/text/score').reply(200, {
    score: 85,
    sensitivity: 'potentially sensitive'
});

// Mock the user history API response
mock.onGet('/users/123/reviews').reply(200, {
    userId: '123',
    history: [
        { text: 'I love you', score: 15, sensitivity: 'normal' },
        { text: 'I will harm you', score: 95, sensitivity: 'sensitive' }
    ]
});

export default API;
