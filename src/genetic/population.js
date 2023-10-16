import DNA from "./DNA";

class Population {
    constructor(populationSize, mutationRate, targetPhrase) {
        this.populationArray = [];
        this.targetPhrase = targetPhrase;
        this.generation = 0;
        this.mutationRate = mutationRate;
        this.populationSize = populationSize;
        this.currentBest = null;
        this.sumFitness = 0;
    }

    foundSolution() {
        if (this.currentBest) {
            return this.currentBest.getFitness() >= 1;
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
        const that = this;
        const sumFitness = this.populationArray.reduce((cumulativeFitness, individual) => {
            individual.calcFitness(target, cumulativeFitness)
            if (!that.currentBest || that.currentBest.getFitness() < individual.getFitness()) {
                that.currentBest = individual;
            }
            return cumulativeFitness + individual.getFitness();
        }, 0);
        this.sumFitness = sumFitness;
    }

    getCurrentBest() {
        return this.currentBest;
    }

    map(current, in_min, in_max, out_min, out_max) {
        const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
        //clamp, to be sure
        return mapped < out_min ? out_min : mapped > out_max ? out_max : mapped;
    }

    //Create a new generation
    newGeneration() {
        if (this.sumFitness === 0) {
            throw new Error("The sum of fitnesses has not been computed yet");
        }
        if (this.populationArray.length === 0) {
            throw new Error("The population is empty");
        }
        const newPopulation = [];
        for (let i = 0; i < this.populationArray.length; i++) {
            const firstIndividual = this.pickRandomIndividualGivenFitness();
            const secondInvidiual = this.pickRandomIndividualGivenFitness(); //We authorize the individual to breed with himself but should we ?
            //It's time to breed and replace the old population
            const child = firstIndividual.breed(secondInvidiual, this.mutationRate);
            newPopulation.push(child);
        }
        this.generation = this.generation + 1;
        this.populationArray = newPopulation;
        console.debug(`New population : ${this.populationArray}`);
    }

    pickRandomIndividualGivenFitness() {
        //Let's think about a geometric representation for our fitness distribution.
        //The total cumulative fitness of the population is the length of a segment [a, e]
        //The [a, e] segment is divided into adjacent segments [x, y] with a length representating the fitness of each individual.
        //For each adjacent segment (or sub segment of [a, e]), we compute the length from the start of [a, e] to the end of [x, y]  : [a, y]. This is the cumulative fitness.
        // For example :
        // a --- b -- c ---- d - e
        // Represents
        // [{a fitness : 0.3, cumulativeFitness:0.3} length([a,b]) = 0.3
        // {b fitness 0.2,cumulativeFitness:0.5},    length([a,c]) = 0.5
        // {c fitness: 0.4,cumulativeFitness:0.9},   length([a,d]) = 0.9
        // {d fitness: 0.1, cumulativeFitness:1}],   length([a,e]) = 1
        
        //If I pick a random point in [a, e], and look into which sub segment it matches, it is more likely to find the longer sub segment.
        //If i pick a lot of random points and find the sub segment, this should get me a distribution of sub segment with probabilities matching the length of each one.
        //This is what we want to generate a new population where the most fit individuals have a higher probability of getting picked.

        //To get the sub segment efficiently, we can find the first segment that has a length from [a, endOfSegment] > our random point. This length is the cumulative fitness.
        //Example :
        //randomNumber = 0 , picked a, (0.3 > 0)
        //randomNumber = 0.11 , picked a, (0.3 > 0.11)
        //randomNumber = 0.21 , picked a,  (etc...)
        //randomNumber = 0.31 , picked b,
        //randomNumber = 0.41 , picked b,
        //randomNumber = 0.51, picked c, 
        //randomNumber = 0.61, picked  c, 
        //randomNumber = 0.71, picked  c
        //randomNumber = 0.81, picked  c
        //randomNumber = 0.91, picked  d
        //We see that c is picked 4 times, d 1 time , a 3 times and b 2 times. It matches the wanted distribution.

        //In our population, the length of the segment [a, e] is unbounded (depends on the size of the pop). We need to map the random number
        //which is always between 0 and 1, to a number that can be between 0 and the length of the segment.
        const random = this.map(Math.random(), 0, 1, 0, this.sumFitness);
        return this.populationArray.find(p =>  p.getCumulativeFitness() > random);
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
        pop.targetPhrase = this.targetPhrase;
        pop.generation = this.generation;
        pop.mutationRate = this.mutationRate;
        pop.populationSize = this.populationSize;
        pop.currentBest = this.currentBest;
        pop.sumFitness = this.sumFitness;
        return pop;
    }
};
export default Population;