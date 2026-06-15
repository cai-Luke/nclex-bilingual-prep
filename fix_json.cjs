const fs = require('fs');
let data = JSON.parse(fs.readFileSync('/Users/holemini/Desktop/Project Shrimp/banks/banks-raw/opus-lithium_toxicity-2026-06-14.json', 'utf8'));

// Fix Exhibits title vs name
function fixExhibit(exh) {
  if (exh.name && !exh.title) {
    exh.title = exh.name;
    delete exh.name;
  }
}

data.questions[0].caseStudy.exhibits.forEach(fixExhibit);
data.questions[0].caseStudy.stages.forEach(stage => {
  if (!stage.title) {
    stage.title = stage.narrative || { en: "Stage", zh: "阶段" };
  }
  if (stage.exhibits) {
    stage.exhibits.forEach(fixExhibit);
  }
});

// Fix options text
data.questions[0].caseStudy.questions.forEach(q => {
  if (q.options) {
    q.options.forEach(opt => {
      if (opt.text) {
        opt.en = opt.text.en;
        opt.zh = opt.text.zh;
        delete opt.text;
      }
    });
  }
});

// Fix bowtie
let bt = data.questions[1];
bt.bowtie = {
  condition: bt.condition,
  actions: bt.actions,
  parameters: bt.parameters
};
delete bt.condition;
delete bt.actions;
delete bt.parameters;

fs.writeFileSync('/Users/holemini/Desktop/Project Shrimp/banks/banks-raw/opus-lithium_toxicity-2026-06-14.json', JSON.stringify(data, null, 2));
console.log('Fixed');
