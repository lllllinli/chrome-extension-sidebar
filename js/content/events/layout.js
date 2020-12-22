class Layout {
  eventType = 'CHANGE_LAYOUT';
  event = new Event(this.eventType);
  constructor(handle) {
    document.addEventListener(this.eventType, handle);
  }

  dispatchEvent() {
    document.dispatchEvent(this.event);
  }

}

