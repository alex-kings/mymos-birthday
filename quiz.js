
const questions = [
    [
        `👑 Qui est le roi de la Moyte?`,
        [ 'thostu', 'jolyney', 'bouliney', 'moytiking', 'jolyroi', 'jolyking' ],
        `Je vais accepter cette réponse, mais c'est contesté.`
    ],
    [
        `🫑 Quel est le résultat de cette recette:
        - Mélangez trois poivrons verts avec de la moutarde
        - Ajoutez une pincée de sel
        - Au four pendant 34 heures a 250 degrés`,
        [ 'riz cantonais', 'glotté', 'machtu', 'flétu' ],
        `Miam! C'est trop bon, le $a!`
    ],
    [
        `⚡ Quel est le job de Zeus?`,
        [ 'technicien', 'météorologue' ],
        `C'est grace a lui que ca fonctionne!`
    ],
    [
        `🎂 Quand est né Jésudor Christophe?`,
        [ '' ],
        `En effet, c'est le $A!`
    ],
    [
        `🦝 De quelle couleur sont les oreilles de la mascotte de la Moyte?`,
        [ 'blanc' ],
        `Imagine si t'avais dit rouge!`
    ],
    [
        `⛷️ Quelle est la piste de ski la plus pratiquée de la Moyte?`,
        [ 'olympique supérieur', 'olympique inférieur' ],
        (_, matched) => matched.includes('sup') ?
                `Ceux qui pensent que c'est l'olympique inférieur ils petent dans les buissons!`
            :
                `Ceux qui pensent que c'est l'olympique supérieur il leur manque un cerveau!`
    ],
    [
        `🚁 Complete la phrase suivante: "L'hélico avec tes cheveux? Mais ils ont ______ ou quoi?!"`,
        [ 'fumé' ],
        `Bravo! T'as gagné un saut en parachute!.... SANS parachute.`
    ],
    [
        `🌰 Quand on fete la fete de la truffe, on va chez...?`,
        [ 'truffalo bill', 'trufalo bill', 'truffallo bill', 'trufallo bill' ],
        `Miom! C'est quand meme excellent, les truffes...`
    ],
    [
        `🐻‍❄️ Quel était le premier FOTD?`,
        [ 'ours polaire', 'ours blanc' ], // it was that polar bear fur is transparent! but any answer with the words 'polar bear' will do :)
        `C'est pas croyable, tout de meme...!`
    ],
    [
        `🔤 Quelle lettre apparait entre 𐤍 (nun) et 𐤏 ('ayin)?`,
        [ 'samek' ],
        `𐤎!`
    ],
    [
        `🚜 Ou est enterré jolypote?`,
        [ 'dans la terre', 'sous la mer', 'dans les cieux', 'jardin', 'moyte', 'montagne', 'prairie', 'champs', 'désert' ],
        `... mais chut, pas un mot!`
    ],
    [
        `🏴‍☠️ Qui est le plus thosté?`,
        [ 'thostu', 'jolyney' ],
        `C'ETAIT MOI!!!! EN ROUTE, THOSTU!!!`
    ],
    [
        `🕵️ Qui a volé les croquinerolles de thostu?`,
        [ '' ],
        answer => `AH PUTAIN C'ETAIT ${answer.toUpperCase()}?! MERCI, JE VAIS L'ATTRAPPER CE SALIGAUD!`
    ]
    // feel free to add more!
];

let attempts = 0;
function quiz () {
    ++attempts;
    
    // shuffle questions
    let currentIndex = questions.length,  randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [questions[currentIndex], questions[randomIndex]] = [questions[randomIndex], questions[currentIndex]];
    }
    
    alert('🎉🎈🎉🎈🎉 Bienvenue sur le quiz Moyte! 🎉🎈🎉🎈🎉');
    for (let i = 0; i < Math.min(10, questions.length); ++i) {
        const [ question, answers, response ] = questions[i];
        const answer = prompt(`Question ${i+1}/${Math.min(10, questions.length)}: ${question}`);
        const matched = answers.find(a => answer.toLowerCase().includes(a));
        if (matched !== undefined) {
            alert(
                typeof response === 'string' ?
                    response.replace('$A', answer).replace('$a', matched)
                :
                    response(answer, matched)
            );
        } else {
            alert(`Eh non, c'est raté... 😔`);
            return;
        }
    }
    alert(`🎉🎈🎉🎈🎉 Woohoo! T'as réussi toutes les questions! En seulement ${attempts} tentative${attempts > 1 ? 's...' : '!'} T'es une vraie moytienne dites-donc! 🎉🎈🎉🎈🎉`);
}
