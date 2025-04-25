(function () {
  const clientId = getOrSetClientId();
  const eventData = {
    client_id: clientId,
    event: 'page_view',
    params: {
      page_location: window.location.href,
      page_title: document.title,
      referrer: document.referrer,
    }
  };

  const img = new Image();
  img.src = `https://retarglow.com/track?data=${encodeURIComponent(JSON.stringify(eventData))}`;
  img.referrerPolicy = 'no-referrer-when-downgrade';

  function getOrSetClientId() {
    const cid = 'retarglow_cid';
    let id = localStorage.getItem(cid);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(cid, id);
    }
    return id;
  }
})();
