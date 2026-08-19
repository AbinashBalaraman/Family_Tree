/**
 * Radial Sunburst & Generational Pedigree Graph Layout Engine
 * Calculates (x, y) coordinates on concentric generation rings
 * matching the "FAMILY ATLAS" circular multi-generation diagram.
 */

export const GENERATION_RADII = {
  1: 520, // Gen I (Great-Grandparents / Ancestors)
  2: 390, // Gen II
  3: 260, // Gen III
  4: 130, // Gen IV (Parents & Spouses)
  0: 0,   // Center Focus (Root Person)
  5: 250, // Gen V (Children)
  6: 390, // Gen VI (Grandchildren)
  7: 520  // Gen VII (Great-Grandchildren)
};

export const BRANCH_COLORS = {
  root: '#0284c7',       // Vivid Sky/Ocean Blue
  paternal: '#3b82f6',   // Classic Royal Blue
  maternal: '#10b981',   // Emerald Green
  spouse: '#f43f5e',     // Rose / Pink
  descendant: '#f59e0b', // Amber / Golden Yellow
  collateral: '#8b5cf6'  // Violet / Purple
};

/**
 * Calculates node positions and link paths
 */
export function calculateRadialLayout(members, relationships, focusMemberId) {
  const nodeMap = new Map();
  const positions = new Map();

  members.forEach(m => nodeMap.set(m.id, m));

  const rootMember = nodeMap.get(focusMemberId) || members.find(m => m.branch === 'root') || members[0];
  if (!rootMember) return { nodes: [], links: [], rings: [] };

  // Place Root Member at the exact center
  positions.set(rootMember.id, {
    x: 0,
    y: 0,
    r: 0,
    angle: 0,
    member: rootMember,
    color: BRANCH_COLORS.root,
    isRoot: true
  });

  // Group other members by generation and branch
  const byGenAndBranch = {
    ancestors: { 1: [], 2: [], 3: [], 4: [] },
    descendants: { 5: [], 6: [], 7: [] },
    spouses: []
  };

  members.forEach(m => {
    if (m.id === rootMember.id) return;

    if (m.generation <= 4 && m.branch !== 'spouse' && m.branch !== 'descendant') {
      const gen = m.generation || 3;
      if (!byGenAndBranch.ancestors[gen]) byGenAndBranch.ancestors[gen] = [];
      byGenAndBranch.ancestors[gen].push(m);
    } else if (m.generation >= 5 || m.branch === 'descendant') {
      const gen = m.generation || 5;
      if (!byGenAndBranch.descendants[gen]) byGenAndBranch.descendants[gen] = [];
      byGenAndBranch.descendants[gen].push(m);
    } else {
      byGenAndBranch.spouses.push(m);
    }
  });

  // 1. Position Ancestors in Upper Hemisphere (Angle range: -165deg to -15deg)
  [4, 3, 2, 1].forEach(gen => {
    const genMembers = byGenAndBranch.ancestors[gen] || [];
    const count = genMembers.length;
    if (count === 0) return;

    const radius = GENERATION_RADII[gen] || 250;
    
    // Sort: paternal to left (-160° to -90°), maternal to right (-90° to -20°)
    const sorted = [...genMembers].sort((a, b) => {
      if (a.branch === 'paternal' && b.branch !== 'paternal') return -1;
      if (a.branch !== 'paternal' && b.branch === 'paternal') return 1;
      return a.firstName.localeCompare(b.firstName);
    });

    const startAngle = -160 * (Math.PI / 180);
    const endAngle = -20 * (Math.PI / 180);
    const angleStep = count > 1 ? (endAngle - startAngle) / (count - 1) : 0;

    sorted.forEach((m, idx) => {
      const angle = count === 1 ? -90 * (Math.PI / 180) : startAngle + idx * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      const color = m.branch === 'paternal' 
        ? BRANCH_COLORS.paternal 
        : m.branch === 'maternal' 
          ? BRANCH_COLORS.maternal 
          : BRANCH_COLORS.collateral;

      positions.set(m.id, {
        x,
        y,
        r: radius,
        angle,
        member: m,
        color,
        isRoot: false
      });
    });
  });

  // 2. Position Descendants in Lower Hemisphere (Angle range: +20deg to +160deg)
  [5, 6, 7].forEach(gen => {
    const genMembers = byGenAndBranch.descendants[gen] || [];
    const count = genMembers.length;
    if (count === 0) return;

    const radius = GENERATION_RADII[gen] || 350;
    const startAngle = 155 * (Math.PI / 180);
    const endAngle = 25 * (Math.PI / 180);
    const angleStep = count > 1 ? (endAngle - startAngle) / (count - 1) : 0;

    genMembers.forEach((m, idx) => {
      const angle = count === 1 ? 90 * (Math.PI / 180) : startAngle + idx * angleStep;
      const x = radius * Math.cos(angle);
      const y = radius * Math.sin(angle);

      positions.set(m.id, {
        x,
        y,
        r: radius,
        angle,
        member: m,
        color: BRANCH_COLORS.descendant,
        isRoot: false
      });
    });
  });

  // 3. Position Spouses & Partners (Sides: ~0deg and ~180deg)
  byGenAndBranch.spouses.forEach((m, idx) => {
    const radius = 135;
    const isRight = idx % 2 === 0;
    const angle = isRight ? (0 + idx * 18) * (Math.PI / 180) : (180 - idx * 18) * (Math.PI / 180);
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);

    positions.set(m.id, {
      x,
      y,
      r: radius,
      angle,
      member: m,
      color: BRANCH_COLORS.spouse,
      isRoot: false
    });
  });

  // Fallback for any unpositioned member
  members.forEach((m, i) => {
    if (!positions.has(m.id)) {
      const angle = (i * 25) * (Math.PI / 180);
      const radius = 300;
      positions.set(m.id, {
        x: radius * Math.cos(angle),
        y: radius * Math.sin(angle),
        r: radius,
        angle,
        member: m,
        color: BRANCH_COLORS.collateral,
        isRoot: false
      });
    }
  });

  // Generate Bezier Curves for relationships
  const links = [];
  relationships.forEach(rel => {
    const fromPos = positions.get(rel.from);
    const toPos = positions.get(rel.to);

    if (!fromPos || !toPos) return;

    const isMarriage = rel.type === 'marriage' || rel.type === 'partner';
    const isSibling = rel.type === 'sibling';

    // Calculate control points for organic Bezier flow
    let path = '';
    const dx = toPos.x - fromPos.x;
    const dy = toPos.y - fromPos.y;

    if (isMarriage) {
      // Gentle horizontal arc
      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2 - 15;
      path = `M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY} ${toPos.x} ${toPos.y}`;
    } else if (isSibling) {
      // Sibling circumferential arch
      const midX = (fromPos.x + toPos.x) / 2;
      const midY = (fromPos.y + toPos.y) / 2 - 20;
      path = `M ${fromPos.x} ${fromPos.y} Q ${midX} ${midY} ${toPos.x} ${toPos.y}`;
    } else {
      // Parent-child radial flow curve
      const cx1 = fromPos.x * 0.7;
      const cy1 = fromPos.y * 0.7;
      const cx2 = toPos.x * 0.3;
      const cy2 = toPos.y * 0.3;
      path = `M ${fromPos.x} ${fromPos.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${toPos.x} ${toPos.y}`;
    }

    const strokeColor = isMarriage 
      ? BRANCH_COLORS.spouse 
      : toPos.color || fromPos.color || '#94a3b8';

    links.push({
      id: rel.id,
      fromId: rel.from,
      toId: rel.to,
      type: rel.type,
      path,
      strokeColor,
      isMarriage,
      midPoint: {
        x: (fromPos.x + toPos.x) / 2,
        y: (fromPos.y + toPos.y) / 2
      }
    });
  });

  // Concentric Generational Guide Rings
  const rings = [
    { label: 'Gen IV', radius: GENERATION_RADII[4], topLabel: 'Gen IV', isCenter: true },
    { label: 'Gen III', radius: GENERATION_RADII[3], topLabel: 'Gen III' },
    { label: 'Gen II', radius: GENERATION_RADII[2], topLabel: 'Gen II' },
    { label: 'Gen I', radius: GENERATION_RADII[1], topLabel: 'Gen I' },
    { label: 'Gen V', radius: GENERATION_RADII[5], bottomLabel: 'Gen V' },
    { label: 'Gen VI', radius: GENERATION_RADII[6], bottomLabel: 'Gen VI' },
    { label: 'Gen VII', radius: GENERATION_RADII[7], bottomLabel: 'Gen VII' }
  ];

  return {
    nodes: Array.from(positions.values()),
    links,
    rings
  };
}
