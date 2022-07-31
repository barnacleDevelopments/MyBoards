import Skill from "./skill";
import Equipment from "./equipment";
import Focus from "./focus";
import Ability from "./ability";

export default interface WorkoutFormViewModel {
    skills: Array<Skill>,
    focuses: Array<Focus>,
    abilities: Array<Ability>,
    equipments: Array<Equipment>
}