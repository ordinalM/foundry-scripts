// Set light for selected tokens
// ordinalm 2026-04-03
// https://daisychase.net/

// Save as a macro
// Select the tokens you want to update, run the macro, pick the option from the dialog, and click the button.

// Adding options:
// To get light update data, select a token with desired light setting, press F12 for the console, then enter:
// canvas.tokens.controlled[0]?.document.light
// Right-click and copy object, then compare the differences to NO_LIGHT (no light) and add those as a new entry in LIGHT_CHANGES.
// Usually what changes is "dim" and "bright". Changing "color" will alter colour and luminosity. Changing "animation"
// will add or alter animation behaviour.

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
const LIGHT_CHANGES = [
    {
        name: "Torch",
        data: {
            alpha: 0.15,
            bright: 3,
            dim: 6,
            color: "#ffad58",
            animation: {
                type: "flame",
                speed: 3,
                intensity: 2,
                reverse: false,
            },
        },
    },
    {
        name: "Candle",
        data: {
            alpha: 0.1,
            bright: 1,
            dim: 3,
            color: "#eccd8b",
            animation: {
                type: "flame",
                speed: 2,
                intensity: 1,
                reverse: false,
            },
        },
    },
    {
        name: "Magic light",
        data: {
            bright: 3,
            dim: 6,
            color: "#004d70",
            animation: {
                type: "starlight",
                speed: 5,
                intensity: 5,
                reverse: false,
            },
        },
    },
    {
        name: "Clear light",
        data: {
            bright: 3,
            dim: 6,
        },
    },
    {
        name: "Dense smoke",
        data: {
            bright: 1,
            dim: 2,
            negative: true,
            animation: {
                type: "denseSmoke",
                speed: 5,
                intensity: 5,
                reverse: false,
            },
        },
    },
    {
        name: "None",
        data: {},
    }
]

const MACRO_TITLE = "Set light for tokens";

const main = async () => {
    if (canvas.tokens.controlled.length === 0) {
        console.warn('No tokens selected')
        await foundry.applications.api.DialogV2.prompt({
            window: {title: MACRO_TITLE},
            content: "<p>No tokens selected</p>",
            ok: {label: 'OK'}
        })
        return
    }

    const lightTypeLabel = (item, index) => {
        const checked = index === 0 ? ' checked' : ''
        const description = []
        for (const x of ["bright", "dim", "color", "negative"]) {
            if (item.data[x]) {
                description.push(`${x} ${item.data[x]}`)
            }
        }
        if (item.data.animation?.type) {
            description.push(`animation ${item.data.animation?.type}`)
        }
        const descriptionText = description.length > 0 ? ` (${description.join(', ')})` : ''

        return `<label><input type="radio" name="choice" value="${index}"${checked}> ${item.name}${descriptionText}</label>`
    }

    let lightType
    lightType = await foundry.applications.api.DialogV2.prompt({
        window: {title: MACRO_TITLE},
        content: LIGHT_CHANGES.map(lightTypeLabel).join(''),
        ok: {
            label: "Pick light type",
            callback: (event, button, dialog) => button.form.elements.choice.value,
        }
    })

    console.debug('lightType', lightType)
    if (!lightType) {
        return
    }

    for (const token of canvas.tokens.controlled) {
        if (!token?.document?.light) {
            continue;
        }
        console.log(`Toggling light to ${LIGHT_CHANGES[lightType].name} for ${token.name}`)

        let lightUpdate = {...NO_LIGHT, ...LIGHT_CHANGES[lightType].data}

        // Multiply the light radii by the current canvas grid scale
        for (const f of ["bright", "dim"]) {
            lightUpdate[f] *= canvas.scene.grid.distance
        }

        // Update the token's light property
        console.debug('lightUpdate', lightUpdate)
        await token.document.update({light: lightUpdate})

        // Ping the token so we know it has worked (comment out if annoying)
        await canvas.ping(token.getCenterPoint())
    }
}

await main()
