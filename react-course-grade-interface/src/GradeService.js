const GradeService = {

    calcLetterGrade(asgnItems) {
        let numberGrade = 0;
        asgnItems.forEach((item) => {
            numberGrade += parseFloat(item.grade) * parseFloat(item.weight) / 100;
        });
        if (numberGrade >= 90) {
           return 'A' 
        }
        if (numberGrade >= 80) {
            return 'B' 
        }
        if (numberGrade >= 70) {
            return 'C' 
        }
        if (numberGrade >= 60) {
            return 'D' 
        }
        return 'F';
    },

    isNormalized(asgnItems) {
        let sumWeights = 0;
        asgnItems.forEach((item) => {
            sumWeights += parseFloat(item.weight);
        });
        if(sumWeights === 100) {
            return true;
        }
        return false;
    }
}
export default GradeService;