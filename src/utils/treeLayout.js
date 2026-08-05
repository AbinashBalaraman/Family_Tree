/**
 * Tree Layout Engine
 * Calculates generation ranks, node coordinates (x, y), and SVG connector curves
 */

export function calculateTreeLayout(members) {
  if (!members || members.length === 0) return { nodes: [], connectors: [] };

  const memberMap = new Map(members.map(m => [m.id, { ...m }]));
  
  // Assign generations if missing
  const generations = new Map();

  function getGen(id, visited = new Set()) {
    if (visited.has(id)) return 1;
    visited.add(id);
    if (generations.has(id)) return generations.get(id);

    const m = memberMap.get(id);
    if (!m) return 1;

    let parentGen = 0;
    if (m.fatherId) parentGen = Math.max(parentGen, getGen(m.fatherId, visited));
    if (m.motherId) parentGen = Math.max(parentGen, getGen(m.motherId, visited));

    const gen = parentGen > 0 ? parentGen + 1 : (m.generation || 1);
    generations.set(id, gen);
    return gen;
  }

  members.forEach(m => getGen(m.id));

  // Group by generation
  const genGroups = new Map();
  memberMap.forEach(m => {
    const gen = generations.get(m.id) || 1;
    if (!genGroups.has(gen)) genGroups.set(gen, []);
    genGroups.get(gen).push(m);
  });

  const sortedGens = Array.from(genGroups.keys()).sort((a, b) => a - b);
  const NODE_WIDTH = 220;
  const NODE_HEIGHT = 140;
  const H_SPACING = 70;
  const V_SPACING = 160;

  const nodePositions = new Map();

  sortedGens.forEach((gen, gIdx) => {
    const group = genGroups.get(gen);
    
    // Sort group to place spouses next to each other
    const orderedGroup = [];
    const added = new Set();

    group.forEach(m => {
      if (added.has(m.id)) return;
      orderedGroup.push(m);
      added.add(m.id);

      if (m.spouseIds && m.spouseIds.length > 0) {
        m.spouseIds.forEach(spId => {
          const spouse = group.find(s => s.id === spId);
          if (spouse && !added.has(spouse.id)) {
            orderedGroup.push(spouse);
            added.add(spouse.id);
          }
        });
      }
    });

    const totalWidth = orderedGroup.length * NODE_WIDTH + (orderedGroup.length - 1) * H_SPACING;
    const startX = -totalWidth / 2;
    const y = gIdx * (NODE_HEIGHT + V_SPACING);

    orderedGroup.forEach((m, idx) => {
      const x = startX + idx * (NODE_WIDTH + H_SPACING);
      nodePositions.set(m.id, { x, y, gen, member: m });
    });
  });

  // Calculate SVG Connectors
  const connectors = [];

  // 1. Spouse Connectors
  const processedSpouses = new Set();
  memberMap.forEach(m => {
    if (m.spouseIds) {
      m.spouseIds.forEach(spId => {
        const pairKey = [m.id, spId].sort().join("_");
        if (processedSpouses.has(pairKey)) return;
        processedSpouses.add(pairKey);

        const pos1 = nodePositions.get(m.id);
        const pos2 = nodePositions.get(spId);

        if (pos1 && pos2) {
          const x1 = pos1.x + NODE_WIDTH / 2;
          const y1 = pos1.y + NODE_HEIGHT / 2;
          const x2 = pos2.x + NODE_WIDTH / 2;
          const y2 = pos2.y + NODE_HEIGHT / 2;

          connectors.push({
            id: `spouse_${pairKey}`,
            type: "spouse",
            path: `M ${x1} ${y1} L ${x2} ${y2}`,
            midX: (x1 + x2) / 2,
            midY: (y1 + y2) / 2
          });
        }
      });
    }
  });

  // 2. Parent -> Child Connectors
  memberMap.forEach(m => {
    if (m.fatherId || m.motherId) {
      const childPos = nodePositions.get(m.id);
      if (!childPos) return;

      let parentX, parentY;

      const fPos = m.fatherId ? nodePositions.get(m.fatherId) : null;
      const mPos = m.motherId ? nodePositions.get(m.motherId) : null;

      if (fPos && mPos) {
        parentX = (fPos.x + mPos.x + NODE_WIDTH) / 2;
        parentY = (fPos.y + mPos.y) / 2 + NODE_HEIGHT / 2;
      } else if (fPos) {
        parentX = fPos.x + NODE_WIDTH / 2;
        parentY = fPos.y + NODE_HEIGHT;
      } else if (mPos) {
        parentX = mPos.x + NODE_WIDTH / 2;
        parentY = mPos.y + NODE_HEIGHT;
      }

      if (parentX !== undefined && parentY !== undefined) {
        const childX = childPos.x + NODE_WIDTH / 2;
        const childY = childPos.y;

        const midY = (parentY + childY) / 2;

        const path = `M ${parentX} ${parentY} C ${parentX} ${midY}, ${childX} ${midY}, ${childX} ${childY}`;

        connectors.push({
          id: `parent_child_${m.id}`,
          type: "parent-child",
          path,
          parentId: m.fatherId || m.motherId,
          childId: m.id
        });
      }
    }
  });

  const nodes = Array.from(nodePositions.values());
  return { nodes, connectors, generations: sortedGens };
}
