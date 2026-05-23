const fs = require('fs');

function fixFile(file) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\n/g, '');
    content = content.replace(/>>>>>>>.*?\n/g, '');
    fs.writeFileSync(file, content, 'utf8');
}

fixFile('.github/workflows/ci-visual-regression.yml');
fixFile('.github/workflows/update-visual-baselines.yml');
