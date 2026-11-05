const views = {
  front: {
    label: 'Front orthographic',
    src: './assets/Fantasy_Parchment_Scroll.png',
    alt: 'Front orthographic render of an ivory parchment scroll with gently curled paper edges',
  },
  depth: {
    label: 'Side-angle geometry inspection',
    src: './assets/Fantasy_Parchment_Depth.png',
    alt: 'Slight side-angle render showing the wider parchment, backward upper curl, and forward lower curl',
  },
  curl: {
    label: 'Bottom curl detail',
    src: './assets/Fantasy_Parchment_Curl_Detail.png',
    alt: 'Close-up of the outward lower paper curl and its visible parchment thickness',
  },
};

const image = document.querySelector('#asset-image');
const label = document.querySelector('#view-label');
const buttons = document.querySelectorAll('[data-view]');

for (const button of buttons) {
  button.addEventListener('click', () => {
    const view = views[button.dataset.view];
    image.src = view.src;
    image.alt = view.alt;
    label.textContent = view.label;
    for (const item of buttons) {
      item.setAttribute('aria-pressed', String(item === button));
    }
  });
}

window.__seek = () => {};
window.__SCENE_READY__ = true;
