class DNA {

    constructor(length) {
        this.genes = [];
        this.fitness = 0;
        this.cumulativeFitness = 0;
        for (let i = 0; i < length; i++) {
            this.genes[i] = this.newChar();
        }
    }

    newChar() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,';
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    }

    //Calculates the fitness given a target phrase. Output is between 0 and 1.
    calcFitness(targetPhrase, cumulativeFitness) {
        if (targetPhrase.length !== this.genes.length) {
            throw new Error("Target phrase array does not have the same length as the genes");
        }
        //Rather basic scoring method, the more characters are equals the fitter the individual is
        let matchedChar = 0;
        for (let i = 0; i< this.genes.length; i++) {
            if (targetPhrase.charAt(i) === this.genes[i]) {
                matchedChar++;
            }   
        }
        this.fitness = matchedChar / targetPhrase.length; //normalize to have an output between 0 and 1
        //This exponential function helps individual being close to the solution to be way more likely to be picked.
        //Without it, the function is linear which can cause performance issues when searching long sentences.
        //Indeed having one more character matching is very significant. It's a breakthrough.
        //Note : fitness is between 0 and 1 so fitness^x is also always between 0 and 1.
        //Note : I found empirically that the longer the target is the higher the exponential must be.
        this.fitness = Math.pow(this.fitness, Math.floor(targetPhrase.length / 2)); 
        this.cumulativeFitness = cumulativeFitness + this.fitness; //Necessary for picking. See population#pickRandomIndividualGivenFitness()
    }

    breed(otherDNA, mutationRate) {
        //Cross over step. We take half the genes of this dna and of half ot the other
        
        const middleIndex = Math.floor(this.genes.length / 2);
        const firstHalf = this.genes.slice(0, middleIndex);
        const newGenes = firstHalf.concat(otherDNA.getGenes().slice(middleIndex));

        console.debug(`First gene pool ${this.toString()} ; second gene pool ${otherDNA.toString()} ; result : ${newGenes.join("")}`);
        if (this.genes.length !== newGenes.length) {
            throw new Error("The child has more genes than allowed");
        }

        const child = new DNA();
        child.genes = newGenes;
        child.fitness = 0;
        child.cumulativeFitness = 0;
        //Add a little random mutation
        child.genes.forEach((gene, index) => {
            if (Math.random() <= mutationRate) {
                child.genes[index] = this.newChar();
            }
        });
        console.debug(`Genes after mutation ${child.toString()}`);
        return child;
    }

    toString() {
        return this.genes.join("");
    }

    getFitness() {
        return this.fitness;
    }

    getGenes() {
        return this.genes;
    }

    getCumulativeFitness() {
        return this.cumulativeFitness;
    }
}
export default DNA;