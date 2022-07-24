import http from '../http-common';

class ViaCepService {
    get(id) {
        return http.get(`/viacep/${id}`);
    }

    create(data) {
        return http.post('/viacep', data);
    }

    update(id, data) {
        return http.put(`/viacep/${id}`, data);
    }

    delete(id) {
        return http.delete(`/viacep/${id}`);
    }

    findByCep(cep) {
        return http.get(`/viacep?zipcode=${cep}`);
    }
}

export default new ViaCepService();