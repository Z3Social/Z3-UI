'use strict';

export default class Settings {
  constructor(keyBase = null) {
    this.keyBase = null;
    this.keyBase = keyBase;
  }
  generateKey(id) {
    return this.keyBase ? [this.keyBase, `id${id}`].join('.') : id;
  }
  set(id, data) {
    const key = this.generateKey(id);
    try {
      const encodedData = JSON.stringify(data);
      localStorage.setItem(key, encodedData);
      return data;
    } catch (e) {
      return null;
    }
  }
  get(id) {
    const key = this.generateKey(id);
    try {
      const rawData = localStorage.getItem(key);
      return rawData ? JSON.parse(rawData) : null;
    } catch (e) {
      return null;
    }
  }
  remove(id) {
    const data = this.get(id);
    if (data) {
      const key = this.generateKey(id);
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Do nothing
      }
    }
    return data;
  }
}

/** Remember push notification settings. */
export const pushNotificationsSetting = new Settings('soapbox_push_notification_data');

/** Remember hashtag usage. */
export const tagHistory = new Settings('soapbox_tag_history');