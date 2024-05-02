sparql_wrapper_user_agent = 'polifonia/1.0 (https://github.com/polifonia-project; polifonia@example.org)'

url_to_update_linkset = 'http://localhost:9999/blazegraph/namespace/kb/sparql/update'
linkset_namespace = 'http://w3id.org/polifonia/linkset/'
linkset_url_enpoint = 'http://localhost:9999/bigdata/sparql'

# specify property path in internal datasets to retrieve same as instances
same_as_path = '<http://www.w3.org/2002/07/owl#sameAs>|<http://www.w3.org/2004/02/skos/core#exactMatch>|<https://schema.org/sameAs>|<http://w3id.org/polifonia/ontology/meetups-ontology#hasWikidataEntity>|^<http://www.w3.org/2002/07/owl#sameAs>|^<http://www.w3.org/2004/02/skos/core#exactMatch>|^<https://schema.org/sameAs>|^<http://w3id.org/polifonia/ontology/meetups-ontology#hasWikidataEntity>'

reconciled_index = True
preferred_iribase_for_labels = ['http://www.wikidata.org/', 'http://dbpedia.org/']