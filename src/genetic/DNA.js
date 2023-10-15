class DNA {

    constructor(length) {
        this.genes = [];
        this.fitness = 0;
        for (let i = 0; i < length; i++) {
            this.genes[i] = this.newChar();
        }
    }

    newChar() {
        const characters = 'abcdefghijklmnopqrstuvwxyz ';
        const randomIndex = Math.floor(Math.random() * characters.length);
        return characters[randomIndex];
    }

    //Calculates the fitness given a target phrase. Output is between 0 and 1.
    calcFitness(targetPhrase) {
        if (targetPhrase.length !== this.genes.length) {
            throw new Error("Target phrase array does not have the same length as the genes");
        }
        let matchedChar = 0;
        for (let i = 0; i< this.genes.length; i++) {
            if (targetPhrase.charAt(i) === this.genes[i]) {
                matchedChar++;
            }   
        }
        this.fitness = matchedChar / targetPhrase.length;
        this.fitness = Math.pow(this.fitness, 4);
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
}
export default DNA;