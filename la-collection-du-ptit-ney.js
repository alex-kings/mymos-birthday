
function showCollection () {
    
    const lerp = (t, a, b) => a + (b - a) * t;
    
    // hsl -> rgb conversion
    function hsl2rgb (h, s, l){
        let r, g, b;
        if (s == 0) r = g = b = l;
        else {
            const hue2rgb = (p, q, t) => {
                if(t < 0) t += 1;
                if(t > 1) t -= 1;
                if(t < 1/6) return p + (q - p) * 6 * t;
                if(t < 1/2) return q;
                if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            }
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return [ Math.round(r * 255), Math.round(g * 255), Math.round(b * 255) ];
    }
    
    // rgb -> hsl conversion
    function rgb2hsl (r, g, b){
        r /= 255, g /= 255, b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max == min) h = s = 0;
        else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch(max){
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return [ h, s, l ];
    }
    
    // get full list of pokemon sprites
    const getSprites = async () =>
        JSON.parse(await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=9999')).text())
            .results
            .map(item => {
                const split = item.url.split('/');
                return parseInt(split[split.length - 2]);
            })
            .map(id => `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`);
    
    // get dominant colour and loaded Image from sprite url
    async function extract (sprite) {
        
        // load into image
        const img = new Image;
        img.crossOrigin = 'anonymous';
        img.src = sprite;
        await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
        });
        
        // extract img data
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const imgData = ctx.getImageData(0, 0, img.width, img.height).data;
        
        // get avg colour
        let r, g, b, total; r = g = b = total = 0;
        for (let i = 0; i < imgData.length; i += 4) {
            if (imgData[i+3] > 0) {
                r += imgData[i];
                g += imgData[i+1];
                b += imgData[i+2];
                ++total;
            }
        }
        return [ rgb2hsl(r/total, g/total, b/total), img ].flat();
    }
    
    
    (async () => {
        
        // prepare renderer
        const canvas = document.querySelector('#collection');
        canvas.width = canvas.parentElement.getBoundingClientRect().width - 40;
        canvas.height = 250;
        const ctx = canvas.getContext('2d');
        
        // draw sprites
        const size = Math.max(canvas.width, canvas.height * 2) * 0.05;
        await Promise.all((await getSprites()).map((sprite, idx) => (async () => {
            try {
                const [h, s, l, img] = await extract(sprite);
                ctx.drawImage(img,
                    Math.min(Math.max(Math.round(h * canvas.width) - size / 2, -size * 0.2), canvas.width - size * 0.8),
                    Math.min(Math.max(Math.round(lerp(l, 1.8, -1) * canvas.height) - size / 2, -size * 0.2), canvas.height - size * 0.8),
                    size,
                    size
                );
            } catch (e) {}
        })()));
        
        // display text
        const desc = document.querySelector('#collection-text');
        for (const child of desc.children) {
            child.style.display = 'none';
        }
        desc.style.display = null;
        for (const child of desc.children) {
            child.style.display = null;
            await new Promise(r => setTimeout(r, 2000));
        }
        await new Promise(r => setTimeout(r, 2000));
        desc.innerHTML = `(Thostu s'est barré en courant aussi vite que possible (0.3km/h))`;
        
    })();
    
}
