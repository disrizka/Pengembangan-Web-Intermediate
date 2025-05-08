import CONFIG from '../config';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES :`${CONFIG.BASE_URL}/stories`,
  STORY_DETAIL: (id) => `${CONFIG.BASE_URL}/stories/${id}`,
  ADD_GUEST_STORY: `${CONFIG.BASE_URL}/stories/guest`,
  NOTIFICATION: `${CONFIG.BASE_URL}/notifications/subscribe`,
};

export async function getData() {
  const fetchResponse = await fetch(ENDPOINTS.ENDPOINT);
  return await fetchResponse.json();
}

export async function signUp(name, email, password) {
  const fetchResponse = await fetch(ENDPOINTS.REGISTER,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    }
  );
    // if (fetchResponse.error) throw new Error(fetchResponse.message);
  return await fetchResponse.json();
}

export async function login(email, password) {
  const fetchResponse = await fetch(ENDPOINTS.LOGIN,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    }
  );
    // if (fetchResponse.error) throw new Error(fetchResponse.message);
  return await fetchResponse.json();
}

export async function getStories(token) {
  const fetchResponse = await fetch(`${ENDPOINTS.STORIES}?location=1`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await fetchResponse.json();
}

// GET detail story
export async function getStoryDetail(id, token) {
  const fetchResponse = await fetch(ENDPOINTS.STORY_DETAIL(id), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await fetchResponse.json();
}

// POST new story (authenticated)
export async function addStory(formData, token) {
  const fetchResponse = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });
  return await fetchResponse.json();
}

// POST new story as guest (unauthenticated)
export async function addGuestStory(formData) {
  const fetchResponse = await fetch(ENDPOINTS.ADD_GUEST_STORY, {
    method: 'POST',
    body: formData,
  });
  return await fetchResponse.json();
}

// SUBSCRIBE web push notification
export async function subscribeNotification(data, token) {
  const fetchResponse = await fetch(ENDPOINTS.NOTIFICATION, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await fetchResponse.json();
}

// UNSUBSCRIBE web push notification
export async function unsubscribeNotification(data, token) {
  const fetchResponse = await fetch(ENDPOINTS.NOTIFICATION, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return await fetchResponse.json();
}
