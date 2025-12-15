// Toggle torches for selected tokens
// ordinalm 2025-12-07

// To use: run script with one or more tokens selected. If they have a light active it will remove it.
// If they have no active light it will add a torch light with a 6-square dim radius and 3-square bright.

// Custom use:
// To get light update data, select a token with desired light setting, F12, then enter:
// canvas.tokens.controlled[0]?.document.light
// Right-click and copy object, then compare the differences to BASE_LIGHT (no light) and add those to TORCH_CHANGES.
// Usually what changes is "dim" and "bright". Changing "color" will alter colour and luminosity. Removing "animation"
// will mean you get a standard non-flickering light - changing "animation.type" will mean a different animation.

// If you want to get an idea of how light works on a code level in Foundry, feel free to play around with the values.
// You can't break anything that can't just be fixed by manually editing the token back.

const BASE_LIGHT = {
    "negative": false,
    "priority": 0,
    "alpha": 0.5,
    "angle": 360,
    "bright": 0,
    "color": null,
    "coloration": 1,
    "dim": 0,
    "attenuation": 0.5,
    "luminosity": 0.5,
    "saturation": 0,
    "contrast": 0,
    "shadows": 0,
    "animation": {
        "type": null,
        "speed": 5,
        "intensity": 5,
        "reverse": false
    },
    "darkness": {
        "min": 0,
        "max": 1
    }
}

const TORCH_CHANGES = {
    "bright": 3,
    "dim": 6,
    "animation": {
        "type": "flame",
        "speed": 5,
        "intensity": 5,
        "reverse": false
    },
}

canvas.tokens.controlled.forEach(async (token) => {
    console.log('toggling torchlight for', token)
    if (!token?.document?.light) {
        return
    }
    let lightUpdate = BASE_LIGHT
    if (token.document.light.dim === 0) {
        lightUpdate = {...lightUpdate, ...TORCH_CHANGES}
    }
    await token.document.update({light: lightUpdate})
})
