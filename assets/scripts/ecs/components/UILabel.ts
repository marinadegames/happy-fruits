import { Label } from 'cc';
import { TypeOfLabel } from 'db://assets/scripts/types';

export class UILabel {
    constructor(
        public label: Label,
        public type: TypeOfLabel
    ) {}
}
