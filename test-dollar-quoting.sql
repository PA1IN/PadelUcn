INSERT INTO test_hash (hash_value) VALUES ($$2b$10$dyAWgR.Fcg3IlTbdAuj6sOy2DLueAj5f9pzaN1PeCj4gLZObRA/fC$$);
SELECT hash_value, length(hash_value) FROM test_hash ORDER BY id DESC LIMIT 1;
