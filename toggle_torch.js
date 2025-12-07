// Toggle torches for selected tokens
// ordinalm 2025-12-07

// To get light update data, select a token with desired light setting, F12, then enter:
// canvas.tokens.controlled[0]?.document.light
// Right-click and copy object

canvas.tokens.controlled.forEach(async (token) => {
    console.log('toggling torchlight for', token)
    if (!token?.document?.light) {
        return
    }
    let lightUpdate = {
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
    if (token.document.light.dim === 0) {
        lightUpdate = {
            "negative": false,
            "priority": 0,
            "alpha": 0.5,
            "angle": 360,
            "bright": 3,
            "color": null,
            "coloration": 1,
            "dim": 6,
            "attenuation": 0.5,
            "luminosity": 0.5,
            "saturation": 0,
            "contrast": 0,
            "shadows": 0,
            "animation": {
                "type": "flame",
                "speed": 5,
                "intensity": 5,
                "reverse": false
            },
            "darkness": {
                "min": 0,
                "max": 1
            }
        }
    }
    await token.document.update({light: lightUpdate})
})