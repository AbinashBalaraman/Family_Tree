/**
 * GEDCOM 5.5 Parser & Exporter
 * Converts Family Tree JSON models <-> GEDCOM format text
 */

export function exportToGEDCOM(members) {
  let ged = [];
  ged.push("0 HEAD");
  ged.push("1 SOUR KINSHIP_STUDIO");
  ged.push("2 VERS 2.0");
  ged.push("1 GEDC");
  ged.push("2 VERS 5.5");
  ged.push("2 FORM LINEAGE-LINKED");
  ged.push("1 CHAR UTF-8");

  // Export Individuals (INDI)
  members.forEach(m => {
    ged.push(`0 @${m.id}@ INDI`);
    ged.push(`1 NAME ${m.firstName} /${m.lastName}/`);
    if (m.gender) {
      ged.push(`1 SEX ${m.gender === 'female' ? 'F' : 'M'}`);
    }
    if (m.birthDate || m.birthPlace) {
      ged.push("1 BIRT");
      if (m.birthDate) ged.push(`2 DATE ${m.birthDate}`);
      if (m.birthPlace) ged.push(`2 PLAC ${m.birthPlace}`);
    }
    if (m.deathDate) {
      ged.push("1 DEAT");
      ged.push(`2 DATE ${m.deathDate}`);
    }
    if (m.occupation) {
      ged.push(`1 OCCU ${m.occupation}`);
    }
    if (m.bio) {
      ged.push(`1 NOTE ${m.bio.replace(/\n/g, " ")}`);
    }
  });

  // Export Families (FAM)
  const familyMap = new Map();
  let famIdx = 1;

  members.forEach(m => {
    if (m.spouseIds && m.spouseIds.length > 0) {
      m.spouseIds.forEach(spouseId => {
        const key = [m.id, spouseId].sort().join("_");
        if (!familyMap.has(key)) {
          const famId = `FAM_${famIdx++}`;
          const isHusband = m.gender === 'male';
          familyMap.set(key, {
            famId,
            husb: isHusband ? m.id : spouseId,
            wife: isHusband ? spouseId : m.id,
            children: m.childrenIds || []
          });
        }
      });
    }
  });

  familyMap.forEach((fam) => {
    ged.push(`0 @${fam.famId}@ FAM`);
    if (fam.husb) ged.push(`1 HUSB @${fam.husb}@`);
    if (fam.wife) ged.push(`1 WIFE @${fam.wife}@`);
    fam.children.forEach(childId => {
      ged.push(`1 CHIL @${childId}@`);
    });
  });

  ged.push("0 TRLR");
  return ged.join("\n");
}

export function parseGEDCOM(text) {
  const lines = text.split(/\r?\n/);
  const members = [];
  const families = [];

  let currentObj = null;
  let currentSub = null;

  lines.forEach(line => {
    const trimmed = line.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const level = parts[0];
    let tag = parts[1];
    let value = parts.slice(2).join(" ");

    if (parts[2] === "INDI" || parts[2] === "FAM") {
      tag = parts[2];
      value = parts[1]; // ID
    }

    if (level === "0") {
      if (currentObj && currentObj.type === "INDI") {
        members.push(currentObj);
      } else if (currentObj && currentObj.type === "FAM") {
        families.push(currentObj);
      }

      if (tag === "INDI") {
        currentObj = {
          type: "INDI",
          id: value.replace(/@/g, ""),
          firstName: "Unknown",
          lastName: "",
          gender: "male",
          birthDate: null,
          birthPlace: "",
          deathDate: null,
          occupation: "",
          bio: "",
          fatherId: null,
          motherId: null,
          spouseIds: [],
          childrenIds: []
        };
      } else if (tag === "FAM") {
        currentObj = {
          type: "FAM",
          id: value.replace(/@/g, ""),
          husb: null,
          wife: null,
          children: []
        };
      } else {
        currentObj = null;
      }
      currentSub = null;
    } else if (currentObj) {
      if (level === "1") {
        currentSub = tag;
        if (tag === "NAME") {
          const nameParts = value.split("/");
          currentObj.firstName = (nameParts[0] || "").trim();
          currentObj.lastName = (nameParts[1] || "").trim();
        } else if (tag === "SEX") {
          currentObj.gender = value.toUpperCase() === "F" ? "female" : "male";
        } else if (tag === "OCCU") {
          currentObj.occupation = value;
        } else if (tag === "NOTE") {
          currentObj.bio = value;
        } else if (tag === "HUSB") {
          currentObj.husb = value.replace(/@/g, "");
        } else if (tag === "WIFE") {
          currentObj.wife = value.replace(/@/g, "");
        } else if (tag === "CHIL") {
          currentObj.children.push(value.replace(/@/g, ""));
        }
      } else if (level === "2" && currentSub) {
        if (currentSub === "BIRT") {
          if (tag === "DATE") currentObj.birthDate = value;
          if (tag === "PLAC") currentObj.birthPlace = value;
        } else if (currentSub === "DEAT") {
          if (tag === "DATE") currentObj.deathDate = value;
        }
      }
    }
  });

  if (currentObj && currentObj.type === "INDI") members.push(currentObj);
  if (currentObj && currentObj.type === "FAM") families.push(currentObj);

  // Reconstruct relationship pointers
  families.forEach(fam => {
    const husb = members.find(m => m.id === fam.husb);
    const wife = members.find(m => m.id === fam.wife);

    if (husb && wife) {
      if (!husb.spouseIds.includes(wife.id)) husb.spouseIds.push(wife.id);
      if (!wife.spouseIds.includes(husb.id)) wife.spouseIds.push(husb.id);
    }

    fam.children.forEach(childId => {
      const child = members.find(m => m.id === childId);
      if (child) {
        if (husb) {
          child.fatherId = husb.id;
          if (!husb.childrenIds.includes(childId)) husb.childrenIds.push(childId);
        }
        if (wife) {
          child.motherId = wife.id;
          if (!wife.childrenIds.includes(childId)) wife.childrenIds.push(childId);
        }
      }
    });
  });

  return members;
}
