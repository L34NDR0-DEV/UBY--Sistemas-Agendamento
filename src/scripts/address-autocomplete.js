/**
 * Sistema de Autocomplete para Endereços usando OpenStreetMap Nominatim API
 * Fornece sugestões de endereços com rua + número + cidade
 */

class AddressAutocomplete {
    constructor() {
        this.cache = new Map();
        this.debounceTimeout = null;
        this.activeDropdowns = new Map();
        this.supportedCities = this.getSupportedCities();
        this.init();
    }

    init() {
        // Aguardar o DOM estar carregado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupAutocomplete());
        } else {
            this.setupAutocomplete();
        }
        this.setupCityChangeListeners();
    }

    getSupportedCities() {
        return [
            // Minas Gerais
            'ALPINÓPOLIS', 'ALTEROSA', 'ARCEBURGO', 'AREADO', 'BAMBUÍ', 'BANDEIRA DO SUL',
            'BOA ESPERANÇA', 'BOM JESUS DA PENHA', 'BOTELHOS', 'CABO VERDE', 'CAMPESTRE',
            'CAMPO DO MEIO', 'CAMPOS GERAIS', 'CARMO DO RIO CLARO', 'CAPITÓLIO',
            'CONCEIÇÃO DA APARECIDA', 'GUAPÉ', 'GUARANÉSIA', 'ILICÍNEA', 'JACUÍ',
            'JURUAIA', 'MONTE BELO', 'MONTE SANTO DE MINAS', 'MUZAMBINHO', 'NEPOMUCENO',
            'NOVA RESENDE', 'PIUMHI', 'SÃO JOSÉ DA BARRA',
            // São Paulo
            'CACONDE', 'CÂNDIDO MOTA', 'DIVINOLÂNDIA', 'ITOBI', 'MOCOCA', 'PALMITAL',
            'PARAGUAÇU PAULISTA', 'SÃO JOSÉ DO RIO PARDO', 'SÃO SEBASTIÃO DA GRAMA',
            'TAPIRATIBA', 'TARUMÃ', 'VARGEM GRANDE DO SUL',
            // Mato Grosso do Sul
            'AQUIDAUANA'
        ];
    }

    getSelectedCity() {
        // Verificar se estamos no formulário principal ou de edição
        const cidadeSelect = document.getElementById('cidade');
        const editCidadeSelect = document.getElementById('editCidade');
        
        if (cidadeSelect && cidadeSelect.value) {
            return cidadeSelect.value.replace('⏰ ', '').replace(' (Fuso Diferente)', '');
        }
        
        if (editCidadeSelect && editCidadeSelect.value) {
            return editCidadeSelect.value.replace('⏰ ', '').replace(' (Fuso Diferente)', '');
        }
        
        return null;
    }

    setupCityChangeListeners() {
        const cidadeSelect = document.getElementById('cidade');
        const editCidadeSelect = document.getElementById('editCidade');
        
        if (cidadeSelect) {
            cidadeSelect.addEventListener('change', () => {
                // Limpar cache quando cidade mudar
                this.cache.clear();
            });
        }
        
        if (editCidadeSelect) {
            editCidadeSelect.addEventListener('change', () => {
                // Limpar cache quando cidade mudar
                this.cache.clear();
            });
        }
    }

    setupAutocomplete() {
        // Campos de endereço para aplicar autocomplete
        const addressFields = [
            'enderecoOrigem',
            'enderecoDestino',
            'editEnderecoOrigem',
            'editEnderecoDestino'
        ];

        addressFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                this.attachAutocomplete(field);
            }
        });

        // Observar mudanças no DOM para campos de parada dinâmicos
        this.observeParadaFields();
    }

    attachAutocomplete(input) {
        const container = this.createDropdownContainer(input);
        
        input.addEventListener('input', (e) => {
            this.handleInput(e.target, container);
        });

        input.addEventListener('focus', (e) => {
            if (e.target.value.length >= 3) {
                this.handleInput(e.target, container);
            }
        });

        input.addEventListener('blur', (e) => {
            // Delay para permitir clique nas sugestões
            setTimeout(() => {
                this.hideDropdown(container);
            }, 200);
        });

        input.addEventListener('keydown', (e) => {
            this.handleKeyNavigation(e, container);
        });
    }

    createDropdownContainer(input) {
        const container = document.createElement('div');
        container.className = 'address-autocomplete-dropdown';
        container.style.display = 'none';
        
        // Inserir após o input
        input.parentNode.style.position = 'relative';
        input.parentNode.appendChild(container);
        
        this.activeDropdowns.set(input, container);
        return container;
    }

    handleInput(input, container) {
        const query = input.value.trim();
        
        if (query.length < 3) {
            this.hideDropdown(container);
            return;
        }

        // Debounce para evitar muitas requisições
        clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
            this.searchAddresses(query, container, input);
        }, 300);
    }

    async searchAddresses(query, container, input) {
        const selectedCity = this.getSelectedCity();
        const cacheKey = selectedCity ? `${query}_${selectedCity}` : query;
        
        // Verificar cache primeiro
        if (this.cache.has(cacheKey)) {
            this.displaySuggestions(this.cache.get(cacheKey), container, input);
            return;
        }

        try {
            this.showLoading(container);
            
            // Construir query com cidade selecionada se disponível
            let searchQuery = query;
            if (selectedCity) {
                searchQuery = `${query}, ${selectedCity}`;
            }
            
            // Primeira busca: endereços gerais
            const response1 = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(searchQuery)}&` +
                `format=json&` +
                `addressdetails=1&` +
                `limit=6&` +
                `countrycodes=br&` +
                `accept-language=pt-BR`
            );

            // Segunda busca: específica para endereços estruturados
            const response2 = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(searchQuery)}&` +
                `format=json&` +
                `addressdetails=1&` +
                `limit=6&` +
                `countrycodes=br&` +
                `accept-language=pt-BR&` +
                `extratags=1&` +
                `namedetails=1`
            );

            // Terceira busca: comércios e pontos de interesse
            const response3 = await fetch(
                `https://nominatim.openstreetmap.org/search?` +
                `q=${encodeURIComponent(searchQuery)}&` +
                `format=json&` +
                `addressdetails=1&` +
                `limit=6&` +
                `countrycodes=br&` +
                `accept-language=pt-BR&` +
                `class=amenity,shop,tourism,leisure&` +
                `extratags=1`
            );

            if (!response1.ok || !response2.ok || !response3.ok) {
                throw new Error('Erro na busca de endereços');
            }

            const data1 = await response1.json();
            const data2 = await response2.json();
            const data3 = await response3.json();
            
            // Combinar e remover duplicatas
            const combinedData = [...data1, ...data2, ...data3];
            const uniqueData = combinedData.filter((item, index, self) => 
                index === self.findIndex(t => t.place_id === item.place_id)
            );
            
            const suggestions = this.formatSuggestions(uniqueData, selectedCity);
            
            // Armazenar no cache
            this.cache.set(cacheKey, suggestions);
            
            this.displaySuggestions(suggestions, container, input);
        } catch (error) {
            console.error('Erro ao buscar endereços:', error);
            this.hideDropdown(container);
        }
    }

    formatSuggestions(data, selectedCity = null) {
        return data.filter(item => {
            const address = item.address || {};
            
            // Aceitar resultados que tenham rua OU que sejam pontos de interesse com nome
            const hasValidAddress = address.road || (item.name && (item.class === 'amenity' || item.class === 'shop' || item.class === 'tourism' || item.class === 'leisure'));
            
            if (!hasValidAddress) return false;
            
            // Filtrar apenas cidades atendidas
            const cidade = (address.city || address.town || address.village || '').toUpperCase();
            const isInSupportedCity = this.supportedCities.some(supportedCity => 
                cidade.includes(supportedCity) || supportedCity.includes(cidade)
            );
            
            return isInSupportedCity;
        }).map(item => {
            const address = item.address || {};
            
            let formattedAddress = '';
            
            // Se for um ponto de interesse (comércio, etc.)
            if (item.name && (item.class === 'amenity' || item.class === 'shop' || item.class === 'tourism' || item.class === 'leisure')) {
                formattedAddress += item.name;
                
                // Adicionar endereço se disponível
                if (address.road) {
                    formattedAddress += ` (${address.road}`;
                    if (address.house_number) {
                        formattedAddress += `, ${address.house_number}`;
                    }
                    formattedAddress += ')';
                }
            } else {
                // Endereço normal: RUA + NÚMERO
                if (address.road) {
                    formattedAddress += address.road;
                    
                    // Número da casa
                    if (address.house_number) {
                        formattedAddress += `, ${address.house_number}`;
                    }
                }
            }

            // Cidade (sem bairro ou estado)
            if (address.city || address.town || address.village) {
                const cidade = address.city || address.town || address.village;
                formattedAddress += ` - ${cidade}`;
            } else if (address.state) {
                // Se não tiver cidade, usar estado como fallback
                formattedAddress += ` - ${address.state}`;
            }

            return {
                formatted: formattedAddress,
                display_name: item.display_name,
                lat: item.lat,
                lon: item.lon,
                address: address,
                name: item.name,
                class: item.class,
                isSelectedCity: selectedCity && (address.city || address.town || address.village || '').toUpperCase().includes(selectedCity.toUpperCase())
            };
        }).filter(item => item.formatted.trim() !== '' && (item.formatted.includes(' - ') || item.name))
        .sort((a, b) => {
            // Priorizar resultados da cidade selecionada
            if (selectedCity) {
                if (a.isSelectedCity && !b.isSelectedCity) return -1;
                if (!a.isSelectedCity && b.isSelectedCity) return 1;
            }
            return 0;
        });
    }

    displaySuggestions(suggestions, container, input) {
        container.innerHTML = '';
        
        if (suggestions.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'autocomplete-no-results';
            noResults.textContent = 'Nenhum endereço encontrado';
            container.appendChild(noResults);
        } else {
            suggestions.forEach((suggestion, index) => {
                const item = document.createElement('div');
                item.className = 'autocomplete-item';
                item.setAttribute('data-index', index);
                
                item.innerHTML = `
                    <div class="autocomplete-address">${suggestion.formatted}</div>
                `;
                
                item.addEventListener('click', () => {
                    this.selectSuggestion(suggestion, input, container);
                });
                
                container.appendChild(item);
            });
        }
        
        this.showDropdown(container);
    }

    selectSuggestion(suggestion, input, container) {
        input.value = suggestion.formatted;
        
        // Armazenar coordenadas como atributo data para uso posterior
        input.setAttribute('data-lat', suggestion.lat);
        input.setAttribute('data-lon', suggestion.lon);
        
        // Disparar evento personalizado para notificar sobre a seleção
        const event = new CustomEvent('addressSelected', {
            detail: {
                address: suggestion.formatted,
                lat: suggestion.lat,
                lon: suggestion.lon,
                fullData: suggestion
            }
        });
        input.dispatchEvent(event);
        
        this.hideDropdown(container);
    }

    showLoading(container) {
        container.innerHTML = '<div class="autocomplete-loading">Buscando endereços...</div>';
        this.showDropdown(container);
    }

    showDropdown(container) {
        container.style.display = 'block';
    }

    hideDropdown(container) {
        container.style.display = 'none';
    }

    handleKeyNavigation(event, container) {
        const items = container.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;

        const currentSelected = container.querySelector('.autocomplete-item.selected');
        let selectedIndex = currentSelected ? parseInt(currentSelected.getAttribute('data-index')) : -1;

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
                this.updateSelection(items, selectedIndex);
                break;
                
            case 'ArrowUp':
                event.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, 0);
                this.updateSelection(items, selectedIndex);
                break;
                
            case 'Enter':
                event.preventDefault();
                if (currentSelected) {
                    currentSelected.click();
                }
                break;
                
            case 'Escape':
                this.hideDropdown(container);
                break;
        }
    }

    updateSelection(items, selectedIndex) {
        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
    }

    observeParadaFields() {
        // Observer para campos de parada que são criados dinamicamente
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const paradaInputs = node.querySelectorAll('.parada-input');
                        paradaInputs.forEach(input => {
                            if (!this.activeDropdowns.has(input)) {
                                this.attachAutocomplete(input);
                            }
                        });
                    }
                });
            });
        });

        // Observar mudanças no container de paradas
        const paradasContainer = document.getElementById('paradas-container');
        if (paradasContainer) {
            observer.observe(paradasContainer, {
                childList: true,
                subtree: true
            });
        }

        // Observar mudanças no container de edição de paradas
        const editParadasContainer = document.getElementById('edit-paradas-container');
        if (editParadasContainer) {
            observer.observe(editParadasContainer, {
                childList: true,
                subtree: true
            });
        }
    }
}

// Inicializar o sistema de autocomplete
window.addressAutocomplete = new AddressAutocomplete();

// Exportar para uso em outros módulos se necessário
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AddressAutocomplete;
}