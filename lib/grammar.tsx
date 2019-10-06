import * as React from 'react';

export type Terminal = string | JSX.Element;

export interface Rule {
    evaluate: (grammar: Grammar) => Terminal;
}

export interface Grammar {
    [symbol: string]: RuleOrTerminal;
}

export function any(...rules: RuleOrTerminal[]): Rule {
    return new AnyRule(rules);
}

export function all(...rules: RuleOrTerminal[]): Rule {
    return new AllRule(rules);
}

export function symbol(symbol: string): Rule {
    return new SymbolRule(symbol);
}

function evaluate(rule: RuleOrTerminal, grammar: Grammar): Terminal {
    if (typeof (rule as Rule).evaluate === 'function') {
        return (rule as Rule).evaluate(grammar);
    } else {
        return <>{rule}</>;
    }
}

export type RuleOrTerminal = Rule | Terminal;

class AnyRule implements Rule {

    private rules: RuleOrTerminal[];

    constructor(rules: RuleOrTerminal[]) {
        this.rules = rules;
    }

    evaluate(grammar: Grammar) {
        return evaluate(this.rules[Math.floor(Math.random() * this.rules.length)], grammar);
    }

}

class AllRule implements Rule {

    private rules: RuleOrTerminal[];

    constructor(rules: RuleOrTerminal[]) {
        this.rules = rules;
    }

    evaluate(grammar: Grammar) {
        return <>{this.rules.map((rule) => evaluate(rule, grammar))}</>;
    }

}

class SymbolRule implements Rule {

    private symbol: string;

    constructor(symbol: string) {
        this.symbol = symbol;
    }

    evaluate(grammar: Grammar) {
        return evaluate(grammar[this.symbol], grammar);
    }

}
