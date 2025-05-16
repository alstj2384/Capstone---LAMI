package lami.capstoneworkbook.domain.repository;

import lami.capstoneworkbook.domain.entity.WorkBook;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkBookRepository extends JpaRepository<WorkBook, Long>, JpaSpecificationExecutor<WorkBook> {
}
