<script lang="ts" setup>
import { ref, watch } from "vue";

const props = defineProps<{ isOpen: boolean }>();
const emits = defineEmits<{ close: [] }>();

const dialogRef = ref<HTMLDialogElement>();

watch(() => props.isOpen, (newValue) => {
    if(newValue) {
        dialogRef.value?.showModal()
    } else {
        dialogRef.value?.close()
    }
} )

const handleClose = () => {
  dialogRef.value?.close();
  emits("close");
};
</script>
<template>
  <dialog  ref="dialogRef" class="dialog">
    <div class="closeButtonContainer"><button @click="handleClose" class="circularButton">X</button></div>
    <slot></slot>
    <div>
    </div>
  </dialog>
</template>
<style scoped>
.dialog {
  border: 1px rgb(190, 190, 190) solid;
  border-radius: 16px;
}

.dialog::backdrop {
  background-color: rgb(201, 201, 201);
  opacity: 0.4;
}

.closeButtonContainer {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
}

.circularButton {
  border-radius: 50%;
  width: 40px;
    height: 40px;
    padding: 0;
}
</style>
