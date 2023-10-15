import DNA from "./DNA";

class Population {
    constructor(populationSize, mutationRate, targetPhrase) {
        this.populationArray = [];
        this.matingPool = [];
        this.targetPhrase = targetPhrase;
        this.generation = 0;
        this.mutationRate = mutationRate;
        this.populationSize = populationSize;
        this.currentBest = null;
    }

    foundSolution() {
        if (this.currentBest) {
            return this.currentBest.getFitness() === 1;
        } else {
            return false;
        }
    }

    setupPopulation() {
        for (let i = 0; i < this.populationSize; i++) {
            this.populationArray[i] = new DNA(this.targetPhrase.length);
        }
        console.debug(`Initial population is ${this.populationArray}`)
    }

    calcFitness() {
        const target = this.targetPhrase;
        this.populationArray.forEach(p => p.calcFitness(target));
    }

    getCurrentBest() {
        return this.currentBest;
    }

    naturalSelection() {
        this.matingPool = [];
        //The higher the fitness the more entries in the mating pool the element gets !
        //In this case we already know the fitness is between 0 and 1
        console.debug(`Selecting from population ${this.populationArray}`);

        //We need to know the max fitness in order to successfully map the fitness in a scale from 1 to 100.
        //Fitness number can be anything, they need to be normalized.
        for (let i = 0; i < this.populationArray.length; i++) {
            const individual = this.populationArray[i];
            if (!this.currentBest || this.currentBest.getFitness() < individual.getFitness()) {
                this.currentBest = individual;
            }
        }
        for (let i = 0; i < this.populationArray.length; i++) {
            const individual = this.populationArray[i];
            console.debug(`Individual ${individual.toString()} fitness : ${individual.getFitness()}`);
            //Normalize the fitness into a range of integer
            let matingEntries = Math.floor(this.map(individual.getFitness(), 0, this.currentBest.getFitness(), 0, 100));
            console.debug(`Mating entries : ${matingEntries}`);
            this.matingPool = this.matingPool.concat(Array(matingEntries).fill(individual));

            console.debug(`Updated mating pool : ${this.matingPool}`);
        }
        console.debug(`The matin pool is ${this.matingPool}`);
    }

    map(current, in_min, in_max, out_min, out_max) {
        const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
        //clamp
        return mapped < out_min ? out_min : mapped > out_max ? out_max : mapped;
    }

    //Create a new generation
    newGeneration() {
        if (this.matingPool.length === 0) {
            throw new Error("The mating pool is empty, cannot generate the new generation.");
        }
        //We just have to generate a new population by taking 2 random elements from the mating pool.
        //The more "fit" individual will be, the more probability it has to get selected
        for (let i = 0; i < this.populationArray.length; i++) {
            const indexFirstInvidual = Math.floor(Math.random() * this.matingPool.length);
            const indexSecondInvidual = Math.floor(Math.random() * this.matingPool.length);
            const firstIndividual = this.matingPool[indexFirstInvidual];
            const secondInvidiual = this.matingPool[indexSecondInvidual];
            //It's time to breed and replace the old population
            const child = firstIndividual.breed(secondInvidiual, this.mutationRate);
            this.populationArray[i] = child;
        }
        this.generation = this.generation + 1;
        console.debug(`New population : ${this.populationArray}`);
    }

    getPopulation() {
        return [...this.populationArray];
    }

    getGeneration() {
        return this.generation;
    }

    getTarget() {
        return this.targetPhrase;
    }

    getMutationRate() {
        return this.mutationRate;
    }

    copy() {
        const pop = new Population();
        pop.populationArray = this.populationArray;
        pop.matingPool = [];
        pop.targetPhrase = this.targetPhrase;
        pop.generation = this.generation;
        pop.mutationRate = this.mutationRate;
        pop.populationSize = this.populationSize;
        pop.currentBest = this.currentBest;
        return pop;
    }
};
export default Population;