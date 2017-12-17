(function () {
    function pseudocodigo() {
        return {
            tokenPostfix: '.js',

            keywords: [
                'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class', 'const', 'continue', 'debugger',
                'default', 'delete', 'do', 'double', 'else', 'enum', 'export', 'extends', 'false', 'final',
                'finally', 'float', 'for', 'function', 'goto', 'if', 'implements', 'import', 'in',
                'instanceof', 'int', 'interface', 'long', 'native', 'new', 'null', 'package', 'private',
                'protected', 'public', 'return', 'short', 'static', 'super', 'switch', 'synchronized', 'this',
                'throw', 'throws', 'transient', 'true', 'try', 'typeof', 'var', 'void', 'volatile', 'while',
                'with',
                // pseudocodigo
                'si', 'entonces', 'sino', 'finsi', 'para', 'finpara', 'funcion', 'finfuncion', 'retornar',
                'hacer', 'mientras', 'finmientras', 'repetir', 'mientrasque', 'segun', 'finsegun', 'deotromodo',
                'caso', 'terminar'
            ],

            ignoreCase: true,
            builtins: [
                'define', 'require', 'window', 'document', 'undefined'
            ],

            operators: [
                '=', '>', '<', '!', '~', '?', ':',
                '==', '<=', '>=', '!=', '&&', '||', '++', '--',
                '+', '-', '*', '/', '&', '|', '^', '%', '<<',
                '>>', '>>>', '+=', '-=', '*=', '/=', '&=', '|=',
                '^=', '%=', '<<=', '>>=', '>>>='
            ],

            // define our own brackets as '<' and '>' do not match in javascript
            brackets: [
                ['(', ')', 'bracket.parenthesis'],
                ['{', '}', 'bracket.curly'],
                ['[', ']', 'bracket.square']
            ],

            // common regular expressions
            symbols: /[~!@#%\^&*-+=|\\:`<>.?\/]+/,
            escapes: /\\(?:[btnfr\\"']|[0-7][0-7]?|[0-3][0-7]{2})/,
            exponent: /[eE][\-+]?[0-9]+/,

            regexpctl: /[(){}\[\]\$\^|\-*+?\.]/,
            regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[0-9a-fA-F]{2}|u[0-9a-fA-F]{4})/,

            tokenizer: {
                root: [
                    // identifiers and keywords
                    [/([a-zA-Z_\$][\w\$]*)(\s*)(:?)/, {
                        cases: {
                            '$1@keywords': ['keyword', 'white', 'delimiter'],
                            '$3': ['key.identifier', 'white', 'delimiter'],   // followed by :
                            '$1@builtins': ['predefined.identifier', 'white', 'delimiter'],
                            '@default': ['identifier', 'white', 'delimiter']
                        }
                    }],

                    // whitespace
                    { include: '@whitespace' },

                    // regular expression: ensure it is terminated before beginning (otherwise it is an opeator)
                    [/\/(?=([^\\\/]|\\.)+\/)/, { token: 'regexp.slash', bracket: '@open', next: '@regexp' }],

                    // delimiters and operators
                    [/[{}()\[\]]/, '@brackets'],
                    [/[;,.]/, 'delimiter'],
                    [/@symbols/, {
                        cases: {
                            '@operators': 'operator',
                            '@default': ''
                        }
                    }],

                    // numbers
                    [/\d+\.\d*(@exponent)?/, 'number.float'],
                    [/\.\d+(@exponent)?/, 'number.float'],
                    [/\d+@exponent/, 'number.float'],
                    [/0[xX][\da-fA-F]+/, 'number.hex'],
                    [/0[0-7]+/, 'number.octal'],
                    [/\d+/, 'number'],

                    // strings: recover on non-terminated strings
                    [/"([^"\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/'([^'\\]|\\.)*$/, 'string.invalid'],  // non-teminated string
                    [/"/, 'string', '@string."'],
                    [/'/, 'string', '@string.\''],
                ],

                whitespace: [
                    [/[ \t\r\n]+/, 'white'],
                    [/\/\*/, 'comment', '@comment'],
                    [/\/\/.*$/, 'comment'],
                ],

                comment: [
                    [/[^\/*]+/, 'comment'],
                    // [/\/\*/, 'comment', '@push' ],    // nested comment not allowed :-(
                    [/\/\*/, 'comment.invalid'],
                    ["\\*/", 'comment', '@pop'],
                    [/[\/*]/, 'comment']
                ],

                string: [
                    [/[^\\"']+/, 'string'],
                    [/@escapes/, 'string.escape'],
                    [/\\./, 'string.escape.invalid'],
                    [/["']/, {
                        cases: {
                            '$#==$S2': { token: 'string', next: '@pop' },
                            '@default': 'string'
                        }
                    }]
                ],

                // We match regular expression quite precisely
                regexp: [
                    [/(\{)(\d+(?:,\d*)?)(\})/, ['@brackets.regexp.escape.control', 'regexp.escape.control', '@brackets.regexp.escape.control']],
                    [/(\[)(\^?)(?=(?:[^\]\\\/]|\\.)+)/, ['@brackets.regexp.escape.control', { token: 'regexp.escape.control', next: '@regexrange' }]],
                    [/(\()(\?:|\?=|\?!)/, ['@brackets.regexp.escape.control', 'regexp.escape.control']],
                    [/[()]/, '@brackets.regexp.escape.control'],
                    [/@regexpctl/, 'regexp.escape.control'],
                    [/[^\\\/]/, 'regexp'],
                    [/@regexpesc/, 'regexp.escape'],
                    [/\\\./, 'regexp.invalid'],
                    ['/', { token: 'regexp.slash', bracket: '@close' }, '@pop'],
                ],

                regexrange: [
                    [/-/, 'regexp.escape.control'],
                    [/\^/, 'regexp.invalid'],
                    [/@regexpesc/, 'regexp.escape'],
                    [/[^\]]/, 'regexp'],
                    [/\]/, '@brackets.regexp.escape.control', '@pop'],
                ],
            },
        };
    }
    var codigo_inicial =
        `// Funciones
Funcion suma(a,b) Hacer
  Retornar a + b
FinFuncion

// Leer, LeerNumero, LeerDecimal
a = LeerNumero("Ingrese un numero")
b = LeerNumero("Ingrese otro numero")
c = suma(a,b)

// Escribir
Escribir("La suma de " + a + " y " + b + " es " + c)

// _Si y _Sino
Si (c == 3) Entonces
  Escribir("la suma da 3")
Sino
  Escribir("la suma no da 3")
FinSi

// _Segun
Segun(c) Hacer
  caso 0: Escribir("Es cero!")
          Terminar
  caso 3: Escribir("Es 3")
          Terminar
  DeOtroModo: Escribir("Es otro..")
FinSegun

// Vectores
lista = []

// _Para
Para(i=0; i<3; i++) Hacer
  lista[i] = Leer("Ingrese un texto para el indice " + i)
FinPara

// _Mientras
i = 0
Mientras(i < lista.length) Hacer
  Escribir("El texto en el indice " + i + " es: " + lista[i])
  i++
FinMientras

// _Repetir
i = 0
Repetir
  i++
  Escribir("Mientras.." + i)
MientrasQue(i<5)
`
    var app = angular.module('PseudoCodigo', []);

    var PalabrasReservadas = [
        {
            palabra: 'si',
            js: 'if'
        },
        {
            palabra: 'entonces',
            js: '{'
        },
        {
            palabra: 'sino',
            js: '}else{'
        },
        {
            palabra: 'finsi',
            js: '}'
        },
        {
            palabra: 'para',
            js: 'for'
        },
        {
            palabra: 'finpara',
            js: '}'
        },
        {
            palabra: 'funcion',
            js: 'function'
        },
        {
            palabra: 'finfuncion',
            js: '}'
        },
        {
            palabra: 'retornar',
            js: 'return'
        },
        {
            palabra: 'hacer',
            js: '{'
        },
        {
            palabra: 'mientras',
            js: 'while'
        },
        {
            palabra: 'finmientras',
            js: '}'
        },
        {
            palabra: 'repetir',
            js: 'do{'
        },
        {
            palabra: 'mientrasque',
            js: '}while'
        },
        {
            palabra: 'segun',
            js: 'switch'
        },
        {
            palabra: 'finsegun',
            js: '}'
        },
        {
            palabra: 'deotromodo:',
            js: 'default:'
        },
        {
            palabra: 'caso',
            js: 'case'
        },
        {
            palabra: 'terminar',
            js: 'break'
        }
    ]

    //console.log(PalabrasReservadas.map(function (v) { return "'" + v.palabra + "'" }).join(','));

    var TiposDeToken = {
        NUMERO: 0,
        PALABRA: 1,
        MENOS: 2,
        MAS: 3,
        POR: 4,
        DIVIDIR: 5,
        IGUAL: 6,
        NO: 7,
        PARENTESIS_INICIO: 8,
        PARENTESIS_FIN: 9,
        CARACTER: 10,
        COMILLA: 11,
        ESPACIO: 12,
        FIN_LINEA: 13,
        TEXTO_ENTRE_COMILLAS: 14,
        TAB: 15
    }

    function Leer(texto) {
        return prompt(texto);
    }

    function LeerNumero(texto) {
        return parseInt(Leer(texto));
    }

    function LeerDecimal(texto) {
        return parseFloat(Leer(texto));
    }

    function Escribir(valor) {
        alert(valor);
    }

    function TokenATexto(numero) {
        switch (numero) {
            case 0: return 'NUMERO';
            case 1: return 'PALABRA';
            case 2: return 'MENOS';
            case 3: return 'MAS';
            case 4: return 'POR';
            case 5: return 'DIVIDIR';
            case 6: return 'IGUAL';
            case 7: return 'NO';
            case 8: return 'PARENTESIS_INICIO';
            case 9: return 'PARENTESIS_FIN';
            case 10: return 'CARACTER';
            case 11: return 'COMILLA';
            case 12: return 'ESPACIO';
            case 13: return 'FIN_LINEA';
            case 14: return 'TEXTO_ENTRE_COMILLAS';
            case 15: return 'TAB';
        }
        return 'SIN DEFINIR';
    }

    function esNumero(caracter) {
        switch (caracter) {
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9": return true;
        }
        return false;
    }

    function esMenos(caracter) {
        return caracter == '-';
    }

    function esMas(caracter) {
        return caracter == '+';
    }

    function esPor(caracter) {
        return caracter == '*';
    }

    function esDividir(caracter) {
        return caracter == '/';
    }

    function esIgual(caracter) {
        return caracter == '=';
    }

    function esNo(caracter) {
        return caracter == '!';
    }

    function esParentesisInicio(caracter) {
        return caracter == '(';
    }

    function esParentesisFin(caracter) {
        return caracter == ')';
    }

    function esComilla(caracter) {
        return caracter == '"';
    }

    function esEspacio(caracter) {
        return caracter == ' ';
    }

    function esFinLinea(caracter) {
        return caracter == '\n';
    }

    function esTab(caracter) {
        return caracter == '\t';
    }

    function esPalabraReservada(palabra) {
        palabra = palabra.toLowerCase();
        for (var i = 0; i < PalabrasReservadas.length; i++) {
            if (palabra == PalabrasReservadas[i].palabra) {
                return i;
            }
        }
        return -1;
    }

    app.controller('PseudoCodigoController', function () {
        this.ejecutar = () => {
            try {
                eval(editor2.getValue());
            } catch (error) {
                this.error = error;
            }
        }
        this.procesar = function () {
            this.entrada = editor.getValue();
            localStorage.setItem("codigo", this.entrada);
            var tokens = [];
            for (var i = 0; i < this.entrada.length; i++) {
                var c = this.entrada[i];
                if (esNumero(c)) {
                    tokens.push({ tipo: TiposDeToken.NUMERO, valor: c });
                } else if (esMenos(c)) {
                    tokens.push({ tipo: TiposDeToken.MENOS, valor: c });
                } else if (esMas(c)) {
                    tokens.push({ tipo: TiposDeToken.MAS, valor: c });
                } else if (esPor(c)) {
                    tokens.push({ tipo: TiposDeToken.POR, valor: c });
                } else if (esDividir(c)) {
                    tokens.push({ tipo: TiposDeToken.DIVIDIR, valor: c });
                } else if (esIgual(c)) {
                    tokens.push({ tipo: TiposDeToken.IGUAL, valor: c });
                } else if (esNo(c)) {
                    tokens.push({ tipo: TiposDeToken.NO, valor: c });
                } else if (esParentesisInicio(c)) {
                    tokens.push({ tipo: TiposDeToken.PARENTESIS_INICIO, valor: c });
                } else if (esParentesisFin(c)) {
                    tokens.push({ tipo: TiposDeToken.PARENTESIS_FIN, valor: c });
                } else if (esComilla(c)) {
                    tokens.push({ tipo: TiposDeToken.COMILLA, valor: c });
                } else if (esEspacio(c)) {
                    tokens.push({ tipo: TiposDeToken.ESPACIO, valor: c });
                } else if (esFinLinea(c)) {
                    tokens.push({ tipo: TiposDeToken.FIN_LINEA, valor: c });
                } else if (esTab(c)) {
                    tokens.push({ tipo: TiposDeToken.TAB, valor: c });
                } else {
                    tokens.push({ tipo: TiposDeToken.CARACTER, valor: c });
                }
            }
            tokens.push({ tipo: TiposDeToken.FIN_LINEA, valor: '\n' });
            /*if (tokens.length > 0) {
                this.salida = tokens.map(function (value) { return TokenATexto(value.tipo) + ' : ' + value.valor }).join('\n');
            } else {
                this.salida = "";
            }*/

            var tokens2 = [];
            if (tokens.length > 0) {
                var esPalabra = false;
                var palabra = "";
                var esTextoEntreComillas = false;
                var texto = "";
                for (var i = 0; i < tokens.length; i++) {
                    if (tokens[i].tipo == TiposDeToken.COMILLA) {
                        if (!esTextoEntreComillas) {
                            esTextoEntreComillas = true;
                            texto = "";
                        } else {
                            esTextoEntreComillas = false;
                            tokens2.push({ tipo: TiposDeToken.TEXTO_ENTRE_COMILLAS, valor: "\"" + texto + "\"" });
                        }
                    } else if (tokens[i].tipo == TiposDeToken.CARACTER) {
                        if (!esTextoEntreComillas) {
                            if (!esPalabra) {
                                esPalabra = true;
                                palabra = tokens[i].valor;
                            } else {
                                palabra += tokens[i].valor;
                            }
                        } else {
                            texto += tokens[i].valor;
                        }
                    } else {
                        if (!esTextoEntreComillas) {
                            if (esPalabra) {
                                esPalabra = false;
                                tokens2.push({ tipo: TiposDeToken.PALABRA, valor: palabra });
                            }
                            tokens2.push(tokens[i]);
                        } else {
                            texto += tokens[i].valor;
                        }
                    }
                }

                if (tokens2.length > 0) {
                    this.salida2 = tokens2.map(function (value) { return TokenATexto(value.tipo) + ' : ' + value.valor }).join('\n');
                } else {
                    this.salida2 = "";
                }
            }

            if (tokens2.length > 0) {
                for (var i = 0; i < tokens2.length; i++) {
                    if (tokens2[i].tipo == TiposDeToken.PALABRA) {
                        var id = esPalabraReservada(tokens2[i].valor);
                        if (id != -1) {
                            tokens2[i].valor = PalabrasReservadas[id].js;
                        }
                    }
                }

                /*if (tokens2.length > 0) {
                    this.salida3 = tokens2.map(function (value) { return TokenATexto(value.tipo) + ' : ' + value.valor }).join('\n');
                } else {
                    this.salida3 = "";
                }*/

                editor2.setValue(tokens2.map(function (value) { return value.valor }).join(''));
            }
        }
        this.referencia = codigo_inicial;
        this.entrada = codigo_inicial;

        let codigo = localStorage.getItem("codigo");
        if (codigo != null && codigo != "") {
            this.entrada = codigo;
        }

        monaco.languages.register({ id: 'pseudocodigo' });
        monaco.languages.setMonarchTokensProvider('pseudocodigo', pseudocodigo());

        var editor;
        var editor2;
        var editor3;
        require(['vs/editor/editor.main'], () => {
            editor = monaco.editor.create(document.getElementById('editor'), {
                value: this.entrada,
                language: 'pseudocodigo'
            });
        });
        require(['vs/editor/editor.main'], () => {
            editor2 = monaco.editor.create(document.getElementById('editor2'), {
                language: 'javascript'
            });
        });
        require(['vs/editor/editor.main'], () => {
            editor3 = monaco.editor.create(document.getElementById('editor3'), {
                value: codigo_inicial,
                language: 'pseudocodigo'
            });
        });

        editor3.updateOptions({ readOnly: true })
        editor.onDidChangeModelContent((e) => { this.procesar() });
        this.procesar();
    });
})();