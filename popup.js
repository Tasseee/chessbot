const controls = {
  skill: document.getElementById('skill'),
  delayMin: document.getElementById('delayMin'),
  delayMax: document.getElementById('delayMax')
};

function updateLabels() {
  for (const key of Object.keys(controls)) {
    document.getElementById(`${key}Value`).textContent = controls[key].value;
  }
  if (Number(controls.delayMin.value) > Number(controls.delayMax.value)) {
    controls.delayMax.value = controls.delayMin.value;
    document.getElementById('delayMaxValue').textContent = controls.delayMax.value;
  }
}

async function save() {
  updateLabels();
  await chrome.storage.local.set({
    skillLevel: Number(controls.skill.value),
    minDelaySeconds: Number(controls.delayMin.value),
    maxDelaySeconds: Number(controls.delayMax.value)
  });
  document.getElementById('status').textContent = 'Gespeichert.';
}

async function load() {
  const saved = await chrome.storage.local.get({
    skillLevel: 10,
    minDelaySeconds: 3,
    maxDelaySeconds: 8
  });
  controls.skill.value = saved.skillLevel;
  controls.delayMin.value = saved.minDelaySeconds;
  controls.delayMax.value = Math.max(saved.minDelaySeconds, saved.maxDelaySeconds);
  updateLabels();
}

for (const control of Object.values(controls)) {
  control.addEventListener('input', save);
}
load();
