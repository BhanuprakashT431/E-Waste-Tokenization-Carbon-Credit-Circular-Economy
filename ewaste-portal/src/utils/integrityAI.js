/**
 * Integrity AI – Component Analysis Engine
 * Simulates scanning e-waste items to determine reusability of each internal component.
 */

// Per-category component database
const COMPONENT_DB = {
  Laptop: [
    { name: 'RAM Module',         type: 'Memory',        condition: () => rnd(['Excellent','Good','Good','Fair']),   reusable: true,  market: 'Refurbished PC market' },
    { name: 'SSD / Hard Disk',    type: 'Storage',       condition: () => rnd(['Good','Good','Fair','Worn']),        reusable: true,  market: 'Data recovery / resale' },
    { name: 'CPU Processor',      type: 'Processing',    condition: () => rnd(['Excellent','Good','Good']),           reusable: true,  market: 'Used CPU resale market' },
    { name: 'LCD Screen Panel',   type: 'Display',       condition: () => rnd(['Good','Fair','Worn','Damaged']),     reusable: true,  market: 'Screen repair shops' },
    { name: 'Lithium Battery',    type: 'Power',         condition: () => rnd(['Fair','Worn','Worn','Exhausted']),   reusable: false, recycleNote: 'Lithium cells for certified recycling' },
    { name: 'Motherboard',        type: 'Circuit',       condition: () => rnd(['Good','Fair','Damaged']),            reusable: true,  market: 'Spare parts for repair' },
    { name: 'Keyboard Assembly',  type: 'Input',         condition: () => rnd(['Good','Good','Fair']),               reusable: true,  market: 'Refurbishment centers' },
    { name: 'WiFi/BT Card',       type: 'Connectivity',  condition: () => rnd(['Excellent','Good']),                 reusable: true,  market: 'IoT / DIY projects' },
    { name: 'Copper Wiring',      type: 'Raw Material',  condition: () => 'Recyclable',                             reusable: false, recycleNote: 'Copper smelting & recovery' },
  ],
  'Mobile Phone': [
    { name: 'OLED / LCD Screen',  type: 'Display',       condition: () => rnd(['Good','Fair','Worn','Damaged']),     reusable: true,  market: 'Phone repair shops' },
    { name: 'Camera Module',      type: 'Optics',        condition: () => rnd(['Excellent','Good','Good']),           reusable: true,  market: 'Repair / IoT cameras' },
    { name: 'Battery Pack',       type: 'Power',         condition: () => rnd(['Fair','Worn','Exhausted']),          reusable: false, recycleNote: 'Li-ion certified recycling' },
    { name: 'Fingerprint Sensor', type: 'Biometric',     condition: () => rnd(['Good','Fair']),                      reusable: true,  market: 'Security device market' },
    { name: 'Speaker / Mic',      type: 'Audio',         condition: () => rnd(['Good','Good','Fair']),               reusable: true,  market: 'Repair shops / DIY' },
    { name: 'PCB / Chipset',      type: 'Circuit',       condition: () => rnd(['Good','Fair','Damaged']),            reusable: false, recycleNote: 'Gold & rare metal extraction' },
    { name: 'Charging Port',      type: 'Connectivity',  condition: () => rnd(['Good','Fair','Worn']),               reusable: true,  market: 'Mobile repair centers' },
  ],
  Monitor: [
    { name: 'LCD Panel',          type: 'Display',       condition: () => rnd(['Good','Good','Fair','Worn']),        reusable: true,  market: 'Refurbished monitor resale' },
    { name: 'Power Supply Unit',  type: 'Power',         condition: () => rnd(['Good','Fair','Fair','Worn']),        reusable: true,  market: 'Electronics repair' },
    { name: 'Backlight LEDs',     type: 'Lighting',      condition: () => rnd(['Good','Good','Fair']),               reusable: true,  market: 'Signage / lighting market' },
    { name: 'Control PCB',        type: 'Circuit',       condition: () => rnd(['Good','Fair','Damaged']),            reusable: true,  market: 'Spare parts' },
    { name: 'Metal Chassis',      type: 'Raw Material',  condition: () => 'Recyclable',                             reusable: false, recycleNote: 'Aluminum / steel smelting' },
    { name: 'Capacitors',         type: 'Component',     condition: () => rnd(['Good','Fair','Worn']),               reusable: true,  market: 'Electronics component resale' },
  ],
  CPU: [
    { name: 'CPU Processor',      type: 'Processing',    condition: () => rnd(['Good','Good','Fair']),               reusable: true,  market: 'Used hardware resale' },
    { name: 'RAM Slots / RAM',    type: 'Memory',        condition: () => rnd(['Excellent','Good','Fair']),          reusable: true,  market: 'Upgrade / refurb market' },
    { name: 'Graphics Card',      type: 'GPU',           condition: () => rnd(['Good','Fair','Worn']),               reusable: true,  market: 'Gaming / mining resale' },
    { name: 'Hard Drive / SSD',   type: 'Storage',       condition: () => rnd(['Good','Fair','Worn']),               reusable: true,  market: 'Data centers / refurb' },
    { name: 'Power Supply',       type: 'Power',         condition: () => rnd(['Good','Fair','Damaged']),            reusable: true,  market: 'PSU resale market' },
    { name: 'Motherboard',        type: 'Circuit',       condition: () => rnd(['Good','Fair','Damaged']),            reusable: true,  market: 'Spare parts' },
    { name: 'Cooling Fan / Heat Sink', type: 'Thermal', condition: () => rnd(['Good','Good','Fair']),               reusable: true,  market: 'PC repair market' },
    { name: 'Copper & Gold Traces', type: 'Raw Material', condition: () => 'Recyclable',                            reusable: false, recycleNote: 'Precious metal extraction' },
  ],
  Tablet: [
    { name: 'Touchscreen Glass',  type: 'Display',       condition: () => rnd(['Good','Fair','Cracked','Worn']),     reusable: true,  market: 'Screen replacement market' },
    { name: 'Battery Pack',       type: 'Power',         condition: () => rnd(['Fair','Worn','Exhausted']),          reusable: false, recycleNote: 'Li-ion certified recycling' },
    { name: 'Camera Module',      type: 'Optics',        condition: () => rnd(['Good','Good','Fair']),               reusable: true,  market: 'Repair shops' },
    { name: 'Speaker Assembly',   type: 'Audio',         condition: () => rnd(['Good','Fair']),                      reusable: true,  market: 'DIY / repair' },
    { name: 'SoC / Chipset',      type: 'Processing',    condition: () => rnd(['Fair','Worn']),                      reusable: false, recycleNote: 'Rare metal recovery' },
  ],
  Battery: [
    { name: 'Lithium-Ion Cells',  type: 'Energy',        condition: () => rnd(['Fair','Worn','Exhausted']),          reusable: false, recycleNote: 'Specialized Li-ion recycling plant' },
    { name: 'BMS Circuit Board',  type: 'Circuit',       condition: () => rnd(['Good','Fair','Damaged']),            reusable: true,  market: 'Battery module repair' },
    { name: 'Nickel / Cobalt',    type: 'Raw Material',  condition: () => 'Recyclable',                             reusable: false, recycleNote: 'Metal smelter recovery' },
    { name: 'Electrolyte',        type: 'Chemical',      condition: () => 'Hazardous – safe disposal required',     reusable: false, recycleNote: 'Certified hazardous waste disposal' },
  ],
  Printer: [
    { name: 'Print Head',         type: 'Mechanism',     condition: () => rnd(['Good','Fair','Worn']),               reusable: true,  market: 'Printer repair market' },
    { name: 'Motor Assembly',     type: 'Actuator',      condition: () => rnd(['Good','Good','Fair']),               reusable: true,  market: 'Robotics / repair' },
    { name: 'Control PCB',        type: 'Circuit',       condition: () => rnd(['Good','Fair','Damaged']),            reusable: true,  market: 'Electronics spare parts' },
    { name: 'Power Unit',         type: 'Power',         condition: () => rnd(['Good','Fair']),                      reusable: true,  market: 'Electronics repair' },
    { name: 'Plastic Chassis',    type: 'Raw Material',  condition: () => 'Recyclable',                             reusable: false, recycleNote: 'ABS plastic recycling' },
  ],
};

const DEFAULT_COMPONENTS = [
  { name: 'Internal Circuit Boards', type: 'Circuit',     condition: () => rnd(['Fair','Worn','Damaged']), reusable: false, recycleNote: 'PCB metal extraction' },
  { name: 'Copper Wiring',           type: 'Raw Material', condition: () => 'Recyclable',                  reusable: false, recycleNote: 'Copper smelting' },
  { name: 'Plastic Housing',         type: 'Raw Material', condition: () => 'Recyclable',                  reusable: false, recycleNote: 'Plastic recycling' },
];

function rnd(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const conditionScore = { Excellent: 95, Good: 78, Fair: 55, Worn: 30, Cracked: 25, Exhausted: 10, Damaged: 8, Recyclable: 0 };

export function analyzeItem(category, weight) {
  const template = COMPONENT_DB[category] || DEFAULT_COMPONENTS;

  // Evaluate each component
  const components = template.map(comp => {
    const cond = comp.condition();
    const score = conditionScore[cond] ?? 50;
    return { ...comp, condition: cond, score };
  });

  const reusable = components.filter(c => c.reusable && c.score >= 25);
  const recycleOnly = components.filter(c => !c.reusable || c.score < 25);

  const overallQuality = Math.round(
    reusable.reduce((acc, c) => acc + c.score, 0) / Math.max(components.length, 1)
  );

  // E-token calculation: base rate × weight × quality multiplier
  const qualityMultiplier = overallQuality > 70 ? 1.4 : overallQuality > 50 ? 1.1 : 0.8;
  const suggestedCC = Number((weight * 10 * qualityMultiplier).toFixed(1));

  const qualityLabel =
    overallQuality >= 75 ? 'High Quality'
    : overallQuality >= 50 ? 'Moderate Quality'
    : 'Low Quality / Worn';

  const qualityColor =
    overallQuality >= 75 ? '#10B981'
    : overallQuality >= 50 ? '#F59E0B'
    : '#EF4444';

  return {
    overallQuality,
    qualityLabel,
    qualityColor,
    suggestedCC,
    reusableComponents: reusable,
    recycleComponents: recycleOnly,
    totalComponents: components.length,
  };
}
