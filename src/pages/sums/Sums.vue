<script setup lang="ts">
    import {ref} from 'vue';

    const DEFAULT = 2
    const steps = ref(DEFAULT)
    const maxValue = ref(101)
    const values = ref<number[]>([])
    const showSum = ref(false)
    const hasSustractions = ref(false)
    const operationString = ref('')
    const result = ref(0);

    const getRandomValue = (max:number) => Math.ceil( Math.random() * max );

    const onNewOperation = () => {
        const newVals = Array(steps.value).fill(null).map(() => getRandomValue(maxValue.value))
        values.value = newVals
        showSum.value = false;

        const getOperationSign = () => hasSustractions.value && Math.random()> 0.7?'-':'+';

        const operationsArray = Array(steps.value).fill(null).map((_,index) => index == 0?null:getOperationSign())
        let tmpResult = newVals[0];
        let tmpOperationString =  [tmpResult.toString()]
        for(let i = 1; i < newVals.length; i++) {
            const current = newVals[i];            
            const currentOperation = operationsArray[i]
                switch(currentOperation) {
                    case '+':
                        tmpResult += current;
                        tmpOperationString.push('+');
                        tmpOperationString.push(current.toString())
                        break;
                    case '-':
                        tmpResult -= current;
                        tmpOperationString.push('-');
                        tmpOperationString.push(current.toString())
                        break;
                    default: 
                        break;
                }
        }
        result.value = tmpResult;
        operationString.value = tmpOperationString.join(' ')
    }

</script>
<template>
    <form @submit.prevent="onNewOperation">
        <label>Steps: <input :value="steps" type="number" @input="e => steps = parseInt(e.target.value,10)"/></label>
        <label>Max: <input :value="maxValue" @input="e => maxValue = parseInt(e.target.value,10)" type="number"/></label>
        <label>Has substractions: <input v-model="hasSustractions" type="checkbox"/></label>

        <button type="submit">new</button>
    </form>
    <div>
        Operacion
        <div>
            <span>{{ operationString }}</span>
        </div>
    </div>
    <div v-if="showSum">Resultado: {{ result }}</div>
    <button @click="showSum = true">Respuesta</button>
</template>