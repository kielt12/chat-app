<template>
  <div>
    <div class="modal">
      <div class="modal-wrapper">
        <div class="modal-container">
          <img :src="modalData.photo" alt="" />
          <div class="modal-title">{{ modalData.title }}</div>
          <div class="modal-text">{{ modalData.text }}</div>
          <div class="modal-button">
            <button class="yes-button" @click="leftButtonFunction()">
              {{ modalData.yesBtnText }}
            </button>
            <button class="no-button" @click="rightButtonFunction()">
              {{ modalData.noBtnText }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: [
    "modalTitle",
    "modalText",
    "leftButtonText",
    "leftButtonFunction",
    "rightButtonFunction",
    "rightButtonText",
    "photo",
    "modalData",
  ],
  setup() {
    return {};
  },
};
</script>

<style scoped>
.modal {
  z-index: 9998;
  top: 0;
  position: fixed;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: table;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

img {
  border-radius: 12px;
  display: block;
  height: 24px;
  margin: 12px auto;
}
.modal-container {
  width: 370px;
  height: 180px;
  margin: 0px auto;
  box-sizing: border-box;
  background-color: #fff;
  border: 1px solid rgba(46, 91, 255, 0.08);
  border-radius: 1px;
}

.modal-title {
  text-align: center;
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
}

.modal-text {
  text-align: center;
  color: #8798ad;
  font-family: Rubik;
  font-style: normal;
  font-weight: normal;
  font-size: 15px;
  line-height: 22px;
}

.modal-button {
  padding-top: 15px;
  padding-left: 24px;
  padding-right: 24px;
}

.yes-button {
  width: 155px;
  height: 40px;
  background: #2e5bff;
  border-radius: 4px;
  border: none;
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  color: #ffffff;
}

.no-button {
  width: 155px;
  height: 40px;
  background: #e84a50;
  border-radius: 4px;
  border: none;
  font-family: Rubik;
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  color: #ffffff;
  float: right;
}
</style>
