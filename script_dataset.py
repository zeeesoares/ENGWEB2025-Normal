import json

with open('dataset.json', 'r', encoding='utf-8') as f:
    original_dataset = json.load(f)

editions_array = []
for edition_id, edition_data in original_dataset.items():
    new_edition = {**edition_data, '_id': edition_data['id']}
    del new_edition['id']  
    editions_array.append(new_edition)

with open('eurovisao_edicoes.json', 'w', encoding='utf-8') as f:
    json.dump(editions_array, f, ensure_ascii=False, indent=2)

print('Arquivo eurovisao_edicoes.json criado com sucesso!')