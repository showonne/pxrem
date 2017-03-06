'use babel'

import autoCompleteProvider from './pxrem-provider.js'

const pxReg = /[+-]?([0-9]*[.])?[0-9]+px/gm

function _convert(res){
    let num = parseFloat(res.match[0])
    num = Number((num / atom.config.get('pxrem.base')).toFixed(atom.config.get('pxrem.length')))
    res.replace(`${num}rem`)
}

class Pxrem {
    config = {
        base: {
            title: 'Default base size',
            description: 'The base size for px convert to rem',
            type: 'integer',
            default: 75,
            minimum: 1
        },
        length: {
            title: 'Default length',
            description: 'The length after decimal point',
            type: 'integer',
            default: 2,
            minium: 0,
            maxium: 20
        }
    }
    activate() {
        let self = this
        atom.commands.add('atom-workspace', 'pxrem:convertAll', () => {
            self.convertAll()
        })
        atom.commands.add('atom-workspace', 'pxrem:convertPartial', () => {
            self.convertPartial()
        })
        this.autoCompleteProvider = autoCompleteProvider
    }
    deactivate() {
        this.autoCompleteProvider = null
    }
    hinter() {
        return this.autoCompleteProvider
    }
    convertAll() {
        const editor = atom.workspace.getActiveTextEditor()
        editor.scan(pxReg, _convert)
    }
    convertPartial() {
        const editor = atom.workspace.getActiveTextEditor()
        const selectedRanges = editor.getSelectedBufferRanges()

        selectedRanges.forEach(function(range){
            editor.scanInBufferRange(pxReg, range, _convert)
        })
    }
}

export default new Pxrem()
