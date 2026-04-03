// Toggle light for selected tokens
// ordinalm 2025-12-07

// To use: run script with one or more tokens selected. If they have a light active it will remove it.
// If they have no active light it will add a "torch" light with a 6-square dim radius and 3-square bright.

// Custom use:
// To get light update data, select a token with desired light setting, press F12 for the console, then enter:
// canvas.tokens.controlled[0]?.light
// Right-click and copy object, then compare the differences to NO_LIGHT (no light) and add those to LIGHT_CHANGES.
// Usually what changes is "dim" and "bright". Changing "color" will alter colour and luminosity. Removing "animation"
// will mean you get a standard non-flickering light - changing "animation.type" will mean a different animation.

// If you want to get an idea of how light works on a code level in Foundry, feel free to play around with the values.
// You can't break anything that can't just be fixed by manually editing the token back.

// https://foundryvtt.com/api/interfaces/foundry.LightSourceData.html
const NO_LIGHT = {
    negative: false,
    priority: 0,
    alpha: 0.5,
    angle: 360,
    bright: 0,
    color: "#000000",
    coloration: 1,
    dim: 0,
    attenuation: 0.5,
    luminosity: 0.5,
    saturation: 0,
    contrast: 0,
    shadows: 0,
    // https://foundryvtt.com/api/interfaces/foundry.data.types.LightAnimationData.html
    animation: {
        type: null,
        speed: 5,
        intensity: 5,
        reverse: false
    },
    darkness: {
        min: 0,
        max: 1
    }
}

// Make sure that "bright" and "dim" are specified in squares
const LIGHT_CHANGES = {
    bright: 3,
    dim: 6,
    animation: {
        // Example types: "flame", "starlight", "sunburst", "fairy"
        type: "flame",
        speed: 5,
        intensity: 5,
        reverse: false,
    },
}

canvas.tokens.controlled.forEach(async (token) => {
    if (!token?.document?.light) {
        return
    }
    const turnOn = token.document.light.dim === 0
    const turnOnText = turnOn ? 'on' : 'off'
    console.log(`Toggling light to ${turnOnText} for ${token.name}`)

    let lightUpdate = NO_LIGHT

    // If currently dim, apply the update including the changes
    if (turnOn) {
        lightUpdate = {...lightUpdate, ...LIGHT_CHANGES}
    }

    // Multiply the light radii by the current canvas grid scale
    for (const f of ["bright", "dim"]) {
        lightUpdate[f] *= canvas.scene.grid.distance
    }
    await token.document.update({light: lightUpdate})

    // Ping the token so we know it has worked (comment out if annoying)
    await canvas.ping(token.getCenterPoint(), {color: turnOn ? "#ffff00" : "#000000"})
})
