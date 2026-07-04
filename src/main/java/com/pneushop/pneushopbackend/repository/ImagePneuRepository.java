package com.pneushop.pneushopbackend.repository;

import com.pneushop.pneushopbackend.entity.ImagePneu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ImagePneuRepository extends JpaRepository<ImagePneu, Long> {

    List<ImagePneu> findByPneuId(Long pneuId);

}