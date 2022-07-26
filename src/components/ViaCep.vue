<template>
  <div class="list row">
    <div class="col-md-12">
      <div class="input-group mb-3">
        <input type="text" class="form-control" placeholder="Pesquisar pelo CEP" ref="cep" v-model="cep" maxlength="8" />

        <div class="input-group-append">
          <button class="btn btn-outline-secondary" type="button" @click="searchCep">
            Buscar
          </button>
          <button class="btn btn-outline-secondary" type="button" @click="resetForm">
            Limpar
          </button>
        </div>
      </div>
      <div v-if="errors.length">
        <ul class="list-group">
          <li class="list-group-item error" v-for="error in errors" v-bind:key="error">{{error}}</li>
        </ul>
      </div>
    </div>

    <div class="col-md-12">
      <h4>Endereço Pesquisado</h4>

      <div v-if="data.length">
        <ul class="list-group">
          <li class="list-group-item" v-for="cep in data" v-bind:key="cep">
            CEP: {{ formatCep(cep.zipcode) }} <br>
            Endereço: {{ cep.address }} <br>
            <small>
              Complemento: {{ cep.complement }} <br>
              Bairro: {{ cep.neighborhood }} <br>
              Cidade/UF: {{ cep.city }}/{{ cep.state }} 
            </small>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import ViaCepService from '../services/ViaCep';
import axios from "axios";

export default {
  name: "search-cep",
  data() {
    return {
      cep: '',
      data: [],
      errors: [],
      inserted: false,
    };
  },
  methods: {
    formatCep(cep) {
      var zipcode = cep.trim().replace(/[^0-9]/g, '').toString();
      var c1 = zipcode.substr(0,2);
      var c2 = zipcode.substr(2,3);
      var c3 = zipcode.substr(5);
      return `${c1}.${c2}-${c3}`;
    },

    resetForm() {
      this.errors = [];
      this.data = [];
      this.inserted = false;
      this.cep = '';
      this.$refs.cep.focus();
    },

    validSearch() {
      this.errors = [];

      if (this.cep.trim().replace(/[^0-9]/g, '').toString().length < 8) {
        this.errors.push('Preencha o campo CEP corretamente (somente números).');
      }

      if (this.errors.length) {
        return false;
      }

      return true;
    },

    searchCep() {
      this.inserted = false;
      this.data = [];

      if (!this.validSearch()) {
        return;
      }

      ViaCepService.findByCep(this.cep.trim().replace(/[^0-9]/g, ''))
        .then(response => {
          if (response.data.length) {
            this.inserted = true;
            this.data = response.data;
          } 
          else {
            this.inserted = false;
            this.searchViaCep();
          } 
        })
        .catch(e => {
          console.log(e);
        });
    },

    searchViaCep() {
      this.data = [];
      var zipcode = this.cep.trim().replace(/[^0-9]/g, '');
      var url_cep = 'https://viacep.com.br/ws/' + zipcode + '/json';

      // clear all headers axios to viacep
      axios.defaults.headers.common = null;

      axios.get(url_cep)
        .then(function (response) {

          if (response.data.erro !== undefined) {
            this.errors = [];
            this.errors.push('CEP inválido.');
          } 
          else {

            var cep = {
              'zipcode': response.data.cep.trim().replace(/[^0-9]/g, ''),
              'address': response.data.logradouro,
              'complement': response.data.complemento,
              'neighborhood': response.data.bairro,
              'state': response.data.uf,
              'city': response.data.localidade
            };

            this.data = [cep];

            if (!this.inserted) {
              ViaCepService.create(cep)
                .then(response => {
                  console.log({'data': response.data});
                  this.inserted = true;
                })
                .catch(e => {
                  console.log(e);
                });
            }
          }

        }.bind(this)).catch(function (error) {
          console.log(error.statusText);
        });
    }
  }
}
</script>

<style>
.list-group-item {
  text-align: left;
  font-weight: bold;
}

.list-group-item small {
  color: grey;
  font-weight: normal;
}

.list-group-item.error {
  color: red;
  border-width: 0;
  padding-top: 0;
  padding-left: 0;
}
</style>
