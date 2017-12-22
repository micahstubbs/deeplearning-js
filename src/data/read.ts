const fs = require('fs');
const csv = require('fast-csv');
import { map, slice } from 'lodash';
import Model from '../model';
import math from '../math';

// const start = Date.now();

function read(targetNum: number) {
  const Y: any = [];
  const X: any = [];
  let count = 0;
  fs.createReadStream("./mnist_sample.csv")
    .pipe(csv())
    .on("data", (data: any) => {
      X[count] = [];
      Y[count] = [];
      const output = parseInt(data[0], 10);
      const input = slice(data, 1);
      if (output === targetNum) {
        Y[count].push([1]);
      } else {
        Y[count].push([0]);
      }
      map(input, (num: string, idx) => {
        X[count][idx] = [parseInt(num, 10)];
      });
      count++;
    })
    .on("end", () => {
      const x = X;
      let parameters = Model.initializeParameters([{
        size: x[0].length,
        activationFunc: '',
      }, {
        size: 4,
        activationFunc: 'relu',
      }, {
        size: 1,
        activationFunc: 'sigmoid',
      }], 0, 1, 0.01);

      for (let i = 1; i <= 10000; i++) {
        map(x, (example: Array<Array<number>>, idx) => {
          const forward = Model.forwardPropagation(example, parameters);
          const grads = Model.backPropagation(
            math.logProbBackward,
            Y[idx],
            forward,
          );
          // console.log(parameters['W1']);
          // console.log(grads['dW1'], 'dW1');
          parameters = Model.updateParameters(parameters, grads, 0.0075);
          // console.log(parameters['W1']);
        });

        if (i % 100 === 0) {
          let predict: any = [];
          const costs: any = [];
          map(x, (example: Array<Array<number>>, idx) => {
            const ro = Model.forwardPropagation(example, parameters);
            const forward = ro.AL;
            const cost = Model.computeCost(forward, Y[idx], math.logProb);
            predict.push(forward);
            costs.push(cost);
          });
          let costSum = 0;
          map(costs, (cost: number) => (
            costSum += cost
          ));
          console.log(`${i}: Cost is ${costSum / costs.length}`);
          predict = map(predict, (subArr: Array<Array<number>>) => (
            map(subArr, (arr) => (
              map(arr, (num) => (
                num > 0.5 ? 1 : 0
              ))
            ))
          ));
          // console.log(predict);
          let correct = 0;
          map(predict, (subArr: Array<Array<number>>, idx) => (
            map(subArr, (arr, i) => (
              map(arr, (num, j) => {
                if (num === Y[idx][i][j]) {
                  correct++;
                }
              })
            ))
          ));
          const m = Y.length;
          console.log(`Accuracy: ${correct / m * 100}%`);
        }
      }

      // console.log('time:', (Date.now() - start) / 1000);
    });
}

export default read;

read(1);
